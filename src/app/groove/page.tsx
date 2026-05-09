import { SiteHeader } from "@/components/site-header";
import { GrooveLab } from "@/components/groove/groove-lab";

export const metadata = {
  title: "Groove Lab — MusicTrainer",
  description:
    "Step-sequencer interactivo para aprender el groove del techno y melodic techno.",
};

export default function GroovePage() {
  return (
    <>
      <SiteHeader />
      <main className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-5xl space-y-8">
          <header>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
              módulo 01 · groove
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Groove Lab
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Aprende el lenguaje rítmico del techno tocando un step-sequencer.
              Empieza por el reto <em>Four on the floor</em> y avanza hasta el
              groove respirado de melodic techno.
            </p>
          </header>

          <GrooveLab />
        </div>
      </main>
    </>
  );
}
