import { SiteHeader } from "@/components/site-header";
import { AudioAnalyzer } from "@/components/deconstruct/audio-analyzer";

export const metadata = {
  title: "Track Deconstructor — MusicTrainer",
  description: "Sube un track de referencia y analízalo por capas.",
};

export default function DeconstructPage() {
  return (
    <>
      <SiteHeader />
      <main className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-4xl space-y-8">
          <header>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
              módulo 05 · deconstrucción
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Track Deconstructor
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Sube un track que te guste — Anyma, Tale of Us, Massano… Verás la
              waveform y un analizador de bandas en vivo. Aprende a identificar
              capas, secciones y movimientos espectrales.
            </p>
          </header>

          <AudioAnalyzer />
        </div>
      </main>
    </>
  );
}
