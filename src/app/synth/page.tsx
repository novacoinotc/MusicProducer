import { SiteHeader } from "@/components/site-header";
import { SynthLab } from "@/components/synth/synth-lab";

export const metadata = {
  title: "Sound Design Lab — MusicTrainer",
  description:
    "Sintetizador interactivo para aprender a crear bajos, leads y pads de melodic techno.",
};

export default function SynthPage() {
  return (
    <>
      <SiteHeader />
      <main className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-6xl space-y-8">
          <header>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
              módulo 02 · sound design
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Sound Design Lab
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Aprende síntesis sustractiva tocando. Modifica osciladores,
              filtros y envolventes en vivo. Imita los presets de melodic techno
              o crea el tuyo desde cero.
            </p>
          </header>

          <SynthLab />
        </div>
      </main>
    </>
  );
}
