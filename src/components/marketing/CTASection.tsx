import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function CTASection() {
  return (
    <section className="py-16 sm:py-24">
      <Container size="tight">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-accent-700 px-6 py-12 text-center sm:px-12 sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.2) 0, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.15) 0, transparent 50%)",
            }}
          />
          <div className="relative">
            <h2 className="text-balance text-3xl font-bold text-white sm:text-4xl">
              Arrête de réviser à l'aveugle.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-balance text-base text-brand-100 sm:text-lg">
              Upload tes documents, obtiens une analyse claire en quelques
              minutes et concentre-toi sur ce qui compte.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                href="/signup"
                variant="secondary"
                size="lg"
                className="bg-white text-brand-700 hover:bg-brand-50"
              >
                Analyser mes documents
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                href="#exemple"
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/10"
              >
                Voir un exemple
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
