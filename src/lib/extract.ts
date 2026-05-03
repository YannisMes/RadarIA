// =====================================================
// Extraction de texte des fichiers MVP (PDF + TXT)
// =====================================================
// /!\ Module server-only — utilise pdf-parse, qui dépend de
// pdfjs-dist et n'a aucun sens côté navigateur.
//
// On importe pdf-parse depuis son sous-chemin "lib/pdf-parse.js"
// pour éviter le bloc de test qu'exécute son index.js quand
// module.parent est falsy (issue connue avec les bundlers).

import "server-only";

// On utilise un require dynamique pour éviter le bloc de test qu'exécute
// pdf-parse au niveau de son index.js quand `module.parent` est falsy
// (issue connue avec les bundlers). Le sous-chemin "lib/pdf-parse.js"
// expose juste la fonction d'extraction, sans test code.
type PdfParseFn = (
  buffer: Buffer | Uint8Array,
) => Promise<{ text: string; numpages: number }>;
const pdf: PdfParseFn = require("pdf-parse/lib/pdf-parse.js");

export const SUPPORTED_EXTRACT_MIMES = [
  "application/pdf",
  "text/plain",
] as const;

export interface ExtractResult {
  text: string;
  /** Nombre approximatif de pages (0 pour les TXT). */
  pages: number;
  /** True si l'extraction a renvoyé du texte exploitable. */
  hasContent: boolean;
  /** Présence d'une erreur d'extraction (le fichier reste uploadé). */
  error?: string;
}

// Limite de longueur : ~80-100 pages dense, largement suffisant
// pour le contexte d'un examen et compatible avec la fenêtre Gemini.
const MAX_TEXT_LENGTH = 250_000;

export async function extractTextFromBuffer(
  buffer: Buffer | Uint8Array,
  mimeType: string,
  fileName?: string,
): Promise<ExtractResult> {
  // Fallback sur l'extension si le MIME est trompeur (cas des navigateurs
  // qui annoncent "application/octet-stream" pour un PDF).
  const lowerName = (fileName ?? "").toLowerCase();
  const isPdf =
    mimeType === "application/pdf" || lowerName.endsWith(".pdf");
  const isTxt =
    mimeType === "text/plain" || lowerName.endsWith(".txt");

  if (isPdf) return extractFromPdf(buffer);
  if (isTxt) return extractFromTxt(buffer);

  return {
    text: "",
    pages: 0,
    hasContent: false,
    error: "Format non pris en charge pour l'extraction de texte.",
  };
}

async function extractFromPdf(
  buffer: Buffer | Uint8Array,
): Promise<ExtractResult> {
  const buf = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
  try {
    const result = await pdf(buf);
    const text = cleanText(result.text).slice(0, MAX_TEXT_LENGTH);
    return {
      text,
      pages: result.numpages ?? 0,
      hasContent: text.length > 50,
    };
  } catch (e) {
    console.error("[extract:pdf]", e);
    return {
      text: "",
      pages: 0,
      hasContent: false,
      error:
        "Impossible de lire ce PDF (peut-être un scan ou un fichier protégé).",
    };
  }
}

function extractFromTxt(buffer: Buffer | Uint8Array): ExtractResult {
  try {
    const decoder = new TextDecoder("utf-8", { fatal: false });
    const raw = decoder.decode(
      Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer),
    );
    const text = cleanText(raw).slice(0, MAX_TEXT_LENGTH);
    return {
      text,
      pages: 0,
      hasContent: text.length > 0,
    };
  } catch (e) {
    console.error("[extract:txt]", e);
    return {
      text: "",
      pages: 0,
      hasContent: false,
      error: "Impossible de lire ce fichier texte.",
    };
  }
}

/**
 * Normalise les retours à la ligne, supprime les espaces parasites
 * et tronque les enchaînements de blank lines.
 */
function cleanText(text: string): string {
  return text
    .replace(/\u0000/g, "") // null bytes
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
