"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "secondary";

interface CheckoutButtonProps {
  plan: "pack" | "premium";
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white shadow-soft hover:bg-brand-700 active:bg-brand-800",
  outline: "bg-transparent text-brand-700 ring-1 ring-brand-300 hover:bg-brand-50",
  secondary:
    "bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50 active:bg-slate-100",
};

export function CheckoutButton({
  plan,
  variant = "primary",
  className,
  children,
}: CheckoutButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onClick = async () => {
    setError(null);
    setPending(true);
    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
        redirectTo?: string;
      };

      if (response.status === 401 && data.redirectTo) {
        router.push(`/login?redirectTo=/pricing`);
        return;
      }

      if (!response.ok || !data.url) {
        setError(data.error ?? "Impossible de démarrer le paiement.");
        setPending(false);
        return;
      }

      // Redirection vers la page Stripe Checkout
      window.location.href = data.url;
    } catch (e) {
      console.error(e);
      setError("Connexion impossible. Réessaie dans un instant.");
      setPending(false);
    }
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className={cn(
          "inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-70",
          VARIANTS[variant],
          className,
        )}
      >
        {pending && (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        )}
        {pending ? "Redirection vers le paiement…" : children}
      </button>
      {error && (
        <p className="mt-2 text-center text-xs text-danger-600">{error}</p>
      )}
    </div>
  );
}
