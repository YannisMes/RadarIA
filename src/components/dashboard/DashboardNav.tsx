import Link from "next/link";
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
                href="/#pricing"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                Tarifs
              </Link>
            </nav>
          </div>

          <UserMenu
            email={email}
            fullName={fullName}
            isPremium={isPremium}
          />
        </div>
      </Container>
    </header>
  );
}
