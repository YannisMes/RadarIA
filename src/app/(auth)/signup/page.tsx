import type { Metadata } from "next";
import { SignupForm } from "./SignupForm";

export const metadata: Metadata = {
  title: "Créer un compte",
  description: "Crée ton compte RadarIA et commence à analyser tes documents.",
};

export default function SignupPage() {
  return <SignupForm />;
}
