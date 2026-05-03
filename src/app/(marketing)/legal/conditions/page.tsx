import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions d'utilisation",
  description: "Conditions générales d'utilisation de RadarIA.",
};

export default function ConditionsPage() {
  return (
    <>
      <p className="text-sm font-medium text-brand-600">Légal</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
        Conditions d'utilisation
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Document indicatif — version brouillon. À remplacer par tes CGU
        définitives validées par un juriste avant la mise en production.
      </p>

      <h2>1. Objet</h2>
      <p>
        RadarIA est un service en ligne d'aide à la préparation d'examens à
        partir de documents fournis par l'utilisateur. Le service produit des
        analyses indicatives basées sur un modèle d'intelligence artificielle.
      </p>

      <h2>2. Pas de promesse de prédiction</h2>
      <p>
        RadarIA ne prétend en aucun cas connaître ni prédire avec certitude le
        sujet réel d'un examen. Toutes les estimations sont basées
        exclusivement sur les documents fournis et ne garantissent pas les
        sujets réels.
      </p>

      <h2>3. Compte utilisateur</h2>
      <p>
        Tu es responsable de la confidentialité de tes identifiants. En cas
        d'usage frauduleux, contacte-nous immédiatement.
      </p>

      <h2>4. Documents uploadés</h2>
      <p>
        Tu garantis disposer des droits sur les documents que tu envoies à
        RadarIA. Tu en restes propriétaire.
      </p>

      <h2>5. Abonnement et paiements</h2>
      <p>
        Les paiements sont opérés par Stripe. Les abonnements peuvent être
        annulés à tout moment depuis ton espace personnel.
      </p>

      <h2>6. Limitation de responsabilité</h2>
      <p>
        Les analyses fournies par RadarIA sont indicatives et ne sauraient
        engager la responsabilité de l'éditeur en cas de résultat à un examen.
      </p>
    </>
  );
}
