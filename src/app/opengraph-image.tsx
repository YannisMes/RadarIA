import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt =
  "RadarIA — Révise les bons chapitres, pas tout le cours.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #6366F1 0%, #4F46E5 35%, #7E22CE 100%)",
          color: "white",
          padding: 80,
          fontFamily: "Inter, sans-serif",
          position: "relative",
        }}
      >
        {/* Glow décoratif */}
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -200,
            width: 600,
            height: 600,
            borderRadius: 9999,
            background: "rgba(255, 255, 255, 0.12)",
            filter: "blur(80px)",
          }}
        />

        {/* Logo + nom */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "rgba(255, 255, 255, 0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid rgba(255, 255, 255, 0.35)",
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 9999,
                background: "white",
              }}
            />
          </div>
          <span style={{ fontSize: 36, fontWeight: 700, letterSpacing: -0.5 }}>
            RadarIA
          </span>
        </div>

        {/* Titre principal */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            marginTop: 60,
          }}
        >
          <span
            style={{
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -1.5,
              maxWidth: 980,
            }}
          >
            Révise les bons chapitres, pas tout le cours.
          </span>
          <span
            style={{
              marginTop: 28,
              fontSize: 28,
              fontWeight: 400,
              opacity: 0.85,
              maxWidth: 900,
              lineHeight: 1.35,
            }}
          >
            L'IA qui analyse ton cours, tes annales et ton syllabus pour
            t'aider à prioriser.
          </span>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 18,
            opacity: 0.85,
          }}
        >
          <span>radaria.app</span>
          <span>Analyse IA · Examen blanc · Plan de révision</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
