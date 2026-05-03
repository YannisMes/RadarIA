import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Container } from "@/components/ui/Container";
import { UserMenu } from "@/components/dashboard/UserMenu";

interface DashboardNavProps {
  email: string;
  fullName?: string | null;
  isPremium: boolean;
}

export function DashboardNav({
  email,
  fullName,
  isPremium,
}: DashboardNavProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" aria-label="Dashboard">
              <Logo />
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              <Link
                href="/dashboard"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                Mes projets
              </Link>
              <Link
                href="/pricing"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                Tarifs
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {!isPremium && (
              <Link
                href="/pricing"
                className="hidden items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 px-3 py-1.5 text-xs font-semibold text-white shadow-soft transition-opacity hover:opacity-95 sm:inline-flex"
              >
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Passer Premium
              </Link>
            )}
            <UserMenu
              email={email}
              fullName={fullName}
              isPremium={isPremium}
            />
          </div>
        </div>
      </Container>
    </header>
  );
}
