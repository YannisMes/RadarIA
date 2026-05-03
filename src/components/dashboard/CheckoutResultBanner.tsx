"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Bannière qui s'affiche au retour de Stripe Checkout.
 * Lit `?checkout=success|cancel` dans l'URL puis nettoie le param
 * via router.replace pour éviter qu'elle ne reste à chaque rechargement.
 */
export function CheckoutResultBanner() {
  const params = useSearchParams();
  const router = useRouter();
  const [variant, setVariant] = useState<"success" | "cancel" | null>(null);

  useEffect(() => {
    const value = params.get("checkout");
    if (value === "success" || value === "cancel") {
      setVariant(value);
      // Nettoyage de l'URL sans recharger
      const next = new URLSearchParams(params.toString());
      next.delete("checkout");
      const query = next.toString();
      router.replace(`/dashboard${query ? `?${query}` : ""}`, {
        scroll: false,
      });
    }
  }, [params, router]);

  if (!variant) return null;

  const isSuccess = variant === "success";

  return (
    <div
      role="status"
      className={cn(
        "mb-6 flex items-start gap-3 rounded-2xl px-4 py-3 ring-1",
        isSuccess
          ? "bg-success-50 text-success-800 ring-success-100"
          : "bg-slate-50 text-slate-700 ring-slate-200",
      )}
    >
      {isSuccess ? (
        <CheckCircle2
          className="mt-0.5 h-5 w-5 shrink-0 text-success-600"
          aria-hidden="true"
        />
      ) : (
        <XCircle
          className="mt-0.5 h-5 w-5 shrink-0 text-slate-400"
          aria-hidden="true"
        />
      )}
      <div className="flex-1">
        <p className="text-sm font-semibold">
          {isSuccess ? "Paiement confirmé 🎉" : "Paiement annulé"}
        </p>
        <p className="mt-0.5 text-sm">
          {isSuccess
            ? "Ton plan est activé. Si l'accès aux fonctionnalités Premium n'est pas immédiat, recharge la page dans un instant."
            : "Pas de soucis, tu peux réessayer ton achat à tout moment depuis la page Tarifs."}
        </p>
      </div>
      <button
        type="button"
        onClick={() => setVariant(null)}
        className="rounded-lg p-1 text-slate-500 transition-colors hover:bg-white/60"
        aria-label="Fermer la bannière"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
