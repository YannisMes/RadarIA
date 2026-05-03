import { cn } from "@/lib/utils";
import type { ConfidenceLevel } from "@/lib/ai/types";

interface PreparationScoreProps {
  score: number;
  confidence: ConfidenceLevel;
  size?: "sm" | "lg";
}

const CONFIDENCE_LABEL: Record<ConfidenceLevel, string> = {
  low: "Confiance faible",
  medium: "Confiance moyenne",
  high: "Confiance élevée",
};

export function PreparationScore({
  score,
  confidence,
  size = "lg",
}: PreparationScoreProps) {
  const tone =
    score >= 70 ? "success" : score >= 40 ? "brand" : "urgent";
  const colors = {
    success: "from-success-500 to-success-600",
    brand: "from-brand-500 to-accent-500",
    urgent: "from-urgent-500 to-danger-500",
  } as const;
  const dim = size === "lg" ? 140 : 96;
  const stroke = size === "lg" ? 12 : 8;
  const radius = (dim - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;

  return (
    <div
      className={cn(
        "relative flex flex-col items-center",
        size === "lg" ? "gap-2" : "gap-1.5",
      )}
    >
      <svg
        width={dim}
        height={dim}
        viewBox={`0 0 ${dim} ${dim}`}
        className="-rotate-90"
        aria-hidden="true"
      >
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          stroke="rgb(241 245 249)"
          strokeWidth={stroke}
          fill="none"
        />
        <defs>
          <linearGradient id={`gradient-${tone}`} x1="0" y1="0" x2="1" y2="1">
            <stop
              offset="0%"
              className={cn(
                tone === "success" && "[stop-color:rgb(34,197,94)]",
                tone === "brand" && "[stop-color:rgb(99,102,241)]",
                tone === "urgent" && "[stop-color:rgb(249,115,22)]",
              )}
            />
            <stop
              offset="100%"
              className={cn(
                tone === "success" && "[stop-color:rgb(22,163,74)]",
                tone === "brand" && "[stop-color:rgb(168,85,247)]",
                tone === "urgent" && "[stop-color:rgb(239,68,68)]",
              )}
            />
          </linearGradient>
        </defs>
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          stroke={`url(#gradient-${tone})`}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn(
            "font-bold text-slate-900",
            size === "lg" ? "text-3xl" : "text-xl",
          )}
        >
          {score}
        </span>
        <span
          className={cn(
            "text-slate-500",
            size === "lg" ? "text-xs" : "text-[10px]",
          )}
        >
          / 100
        </span>
      </div>
      {size === "lg" && (
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-900">
            Score de préparation
          </p>
          <p
            className={cn(
              "mt-0.5 text-xs font-medium",
              tone === "success" && "text-success-700",
              tone === "brand" && "text-brand-700",
              tone === "urgent" && "text-urgent-700",
            )}
          >
            <span
              className={cn(
                "mr-1.5 inline-block h-2 w-2 rounded-full bg-gradient-to-br",
                colors[tone],
              )}
            />
            {CONFIDENCE_LABEL[confidence]}
          </p>
        </div>
      )}
    </div>
  );
}
