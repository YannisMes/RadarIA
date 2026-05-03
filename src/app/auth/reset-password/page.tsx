import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { ResetPasswordForm } from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "Nouveau mot de passe",
  description: "Définis un nouveau mot de passe pour ton compte RadarIA.",
};

export default async function ResetPasswordPage() {
  // L'utilisateur arrive ici après avoir cliqué sur le lien email
  // de reset, et le callback a déjà ouvert une session temporaire.
  // Si pas de session, on renvoie vers /forgot-password.
  const user = await getCurrentUser();
  if (!user) {
    redirect("/forgot-password");
  }

  return <ResetPasswordForm />;
}
