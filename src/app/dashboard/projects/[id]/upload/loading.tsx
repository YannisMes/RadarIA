import { Container } from "@/components/ui/Container";

export default function UploadLoading() {
  return (
    <Container>
      <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />

      <div className="mt-6 max-w-3xl space-y-3">
        <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
        <div className="h-8 w-72 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-96 animate-pulse rounded bg-slate-100" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="h-72 animate-pulse rounded-2xl bg-white ring-1 ring-slate-100" />
          <div className="h-40 animate-pulse rounded-2xl bg-white ring-1 ring-slate-100" />
        </div>
        <div className="space-y-4 lg:col-span-1">
          <div className="h-64 animate-pulse rounded-2xl bg-white ring-1 ring-slate-100" />
          <div className="h-16 animate-pulse rounded-xl bg-white ring-1 ring-slate-100" />
        </div>
      </div>
    </Container>
  );
}
