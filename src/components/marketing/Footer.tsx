import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";

const productLinks = [
  { href: "#fonctionnalites", label: "Fonctionnalités" },
  { href: "#exemple", label: "Exemple" },
  { href: "/pricing", label: "Tarifs" },
  { href: "#faq", label: "FAQ" },
];

const accountLinks = [
  { href: "/login", label: "Se connecter" },
  { href: "/signup", label: "Créer un compte" },
];

const legalLinks = [
  { href: "/legal/conditions", label: "Conditions d'utilisation" },
  { href: "/legal/confidentialite", label: "Confidentialité" },
  { href: "/legal/mentions", label: "Mentions légales" },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <Container>
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-600">
              L'IA qui aide les étudiants à prioriser leurs révisions à partir
              de leurs propres documents.
            </p>
          </div>

          <FooterColumn title="Produit" links={productLinks} />
          <FooterColumn title="Compte" links={accountLinks} />
          <FooterColumn title="Légal" links={legalLinks} />
        </div>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-slate-100 py-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} RadarIA. Tous droits réservés.</p>
          <p className="max-w-2xl text-balance">
            RadarIA fournit des analyses indicatives basées uniquement sur les
            documents fournis et ne garantit pas les sujets réels d'examen.
          </p>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-slate-600 transition-colors hover:text-brand-600"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
