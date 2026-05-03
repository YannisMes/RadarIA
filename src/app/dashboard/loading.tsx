import { Container } from "@/components/ui/Container";

export default function DashboardLoading() {
  return (
    <Container>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-8 w-64 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-4 w-80 animate-pulse rounded bg-slate-100" />
        </div>
        <div className="h-10 w-44 animate-pulse rounded-xl bg-slate-200" />
      </div>

      <div className="mt-8">
        <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl bg-white p-5 ring-1 ring-slate-100"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
                </div>
                <div className="h-6 w-20 animate-pulse rounded-full bg-slate-100" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[0, 1, 2, 3].map((j) => (
                  <div key={j} className="space-y-2">
                    <div className="h-3 w-16 animate-pulse rounded bg-slate-100" />
                    <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
                  </div>
                ))}
              </div>
              <div className="mt-5 border-t border-slate-100 pt-4">
                <div className="h-8 w-32 animate-pulse rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
