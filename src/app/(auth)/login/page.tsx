import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Accède à ton dashboard RadarIA.",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirectTo?: string; message?: string };
}) {
  return (
    <LoginForm
      redirectTo={searchParams.redirectTo}
      initialMessage={searchParams.message}
    />
  );
}
