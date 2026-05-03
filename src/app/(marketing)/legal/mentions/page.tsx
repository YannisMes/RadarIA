import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales de RadarIA.",
};

export default function MentionsPage() {
  return (
    <>
      <p className="text-sm font-medium text-brand-600">Légal</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
        Mentions légales
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Document indicatif — version brouillon. À remplacer par les
        informations réelles de l'éditeur avant la mise en production.
      </p>

      <h2>Éditeur</h2>
      <p>
        RadarIA — Service en ligne d'aide à la préparation d'examens à partir
        de documents fournis par l'utilisateur.
      </p>

      <h2>Hébergement</h2>
      <p>
        Frontend et API : Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA
        91789, USA.
        <br />
        Base de données et stockage : Supabase Inc., 970 Toa Payoh North
        #07-04 Singapore.
      </p>

      <h2>Contact</h2>
      <p>
        Pour toute question, contacte-nous à l'adresse email indiquée dans
        nos communications.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        Le code, les visuels et la marque RadarIA appartiennent à leur
        éditeur. Les contenus uploadés par les utilisateurs restent leur
        propriété.
      </p>
    </>
  );
}
