import { SiteHeader } from "@/components/site-header";
import { ArrangementTimeline } from "@/components/arrange/timeline";

export const metadata = {
  title: "Arrangement Coach — MusicTrainer",
  description: "Plantillas de arreglo de techno y melodic techno por secciones.",
};

export default function ArrangePage() {
  return (
    <>
      <SiteHeader />
      <main className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-5xl space-y-8">
          <header>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
              módulo 04 · arreglo
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Arrangement Coach
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              La estructura de un track de techno tiene reglas. Aquí están las
              tres plantillas más usadas — clásica, melodic con breakdown y
              hipnótica — con cuántos compases dura cada parte y qué entra
              cuándo.
            </p>
          </header>

          <ArrangementTimeline />
        </div>
      </main>
    </>
  );
}
