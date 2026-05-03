import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Confidentialité",
  description: "Politique de confidentialité de RadarIA.",
};

export default function ConfidentialitePage() {
  return (
    <>
      <p className="text-sm font-medium text-brand-600">Légal</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
        Politique de confidentialité
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Document indicatif — version brouillon. À adapter avec un DPO avant la
        mise en production.
      </p>

      <h2>1. Données collectées</h2>
      <ul>
        <li>Informations de compte : email, nom complet.</li>
        <li>
          Informations de projet : matière, niveau d'étude, type d'examen,
          date d'examen, objectif de note.
        </li>
        <li>
          Documents que tu uploades (cours, annales, syllabus) et leur texte
          extrait.
        </li>
        <li>Résultats d'analyse générés par RadarIA.</li>
        <li>Métadonnées techniques classiques (date d'inscription, etc.).</li>
      </ul>

      <h2>2. Stockage</h2>
      <p>
        Tes documents et tes données de profil sont hébergés sur Supabase
        (chiffrement au repos). Les Row Level Security policies font qu'aucun
        autre utilisateur n'a accès à tes données.
      </p>

      <h2>3. Partage avec des tiers</h2>
      <p>
        Le contenu de tes documents est envoyé à l'API Gemini (Google) au
        moment de l'analyse, uniquement pour produire ton résultat. Il n'est
        pas utilisé pour entraîner de modèle. Les paiements passent par Stripe.
      </p>

      <h2>4. Tes droits</h2>
      <p>
        Tu peux à tout moment supprimer un projet (et donc ses documents et
        analyses) depuis ton dashboard. Pour supprimer ton compte ou exercer
        tes droits RGPD, contacte-nous.
      </p>

      <h2>5. Cookies</h2>
      <p>
        RadarIA utilise des cookies de session strictement nécessaires (auth
        Supabase). Aucun cookie publicitaire n'est posé.
      </p>
    </>
  );
}
