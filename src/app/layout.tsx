import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "RadarIA — Révise les bons chapitres, pas tout le cours.",
    template: "%s | RadarIA",
  },
  description:
    "Upload ton cours, tes annales et ton syllabus. RadarIA analyse les sujets qui reviennent, identifie les chapitres prioritaires et te génère un examen blanc réaliste.",
  keywords: [
    "révision",
    "examen",
    "étudiant",
    "IA",
    "annales",
    "syllabus",
    "préparation",
    "fiches",
  ],
  authors: [{ name: "RadarIA" }],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  openGraph: {
    title: "RadarIA — Révise les bons chapitres, pas tout le cours.",
    description:
      "L'IA qui analyse ton cours, tes annales et ton syllabus pour t'aider à prioriser tes révisions.",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
