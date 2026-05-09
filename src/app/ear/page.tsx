import { SiteHeader } from "@/components/site-header";
import { EarTrainer } from "@/components/ear/ear-trainer";

export const metadata = {
  title: "Entrenamiento de oído — MusicTrainer",
  description: "Reconoce intervalos, escalas y progresiones de melodic techno.",
};

export default function EarPage() {
  return (
    <>
      <SiteHeader />
      <main className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-3xl space-y-8">
          <header>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
              módulo 03 · oído
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Entrenamiento de oído
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Tu oído es la herramienta más importante. Empieza con intervalos,
              avanza a escalas y progresiones típicas de Anyma, Tale of Us o
              Mind Against.
            </p>
          </header>

          <EarTrainer />
        </div>
      </main>
    </>
  );
}
