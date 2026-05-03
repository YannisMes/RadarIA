import type { Metadata } from "next";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Mot de passe oublié",
  description: "Réinitialise le mot de passe de ton compte RadarIA.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
