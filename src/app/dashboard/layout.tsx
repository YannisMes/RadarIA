import type { ReactNode } from "react";
import { requireUser } from "@/lib/auth";
import { getUserContext } from "@/lib/profile";
import { DashboardNav } from "@/components/dashboard/DashboardNav";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireUser("/dashboard");
  const ctx = await getUserContext(user.id);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardNav
        email={user.email ?? ""}
        fullName={ctx.profile?.full_name ?? null}
        isPremium={ctx.isPremium}
      />
      <main className="flex-1 py-8">{children}</main>
    </div>
  );
}
