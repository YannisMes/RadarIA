import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: "tight" | "wide";
}

export function Container({
  children,
  className,
  size = "wide",
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        size === "tight" ? "max-w-5xl" : "max-w-7xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
