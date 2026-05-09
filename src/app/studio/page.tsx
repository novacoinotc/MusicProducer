import { SiteHeader } from "@/components/site-header";
import { Studio } from "@/components/studio/studio";

export const metadata = {
  title: "Studio Lite — MusicTrainer",
  description:
    "Mini-DAW dentro del navegador: drums, bass, lead, key, scale y export a WAV.",
};

export default function StudioPage() {
  return (
    <>
      <SiteHeader />
      <main className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-6xl space-y-8">
          <header>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
              studio · mini-DAW
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Studio Lite
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Hace los proyectos del curso sin instalar Ableton. 3 pistas (drums,
              bass, lead), key + scale, exportas a WAV. No reemplaza Ableton para
              tracks completos — pero es suficiente para todo lo que aprendes
              aquí.
            </p>
          </header>
          <Studio />
        </div>
      </main>
    </>
  );
}
