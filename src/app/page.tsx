import Link from "next/link";
import {
  Drum,
  Waves,
  Ear,
  LayoutDashboard,
  ScanSearch,
  Trophy,
  ArrowRight,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const modules = [
  {
    href: "/groove",
    icon: Drum,
    title: "Groove Lab",
    description:
      "Step-sequencer interactivo. Aprende kicks, hats, claps y groove de techno con retos progresivos.",
    level: "Empieza por aquí",
    accent: "from-rose-500/30 to-rose-500/0",
  },
  {
    href: "/synth",
    icon: Waves,
    title: "Sound Design Lab",
    description:
      "Sintetizador visual: oscilladores, filtros, envolventes. Recrea bajos y leads de melodic techno.",
    level: "Nivel 1+",
    accent: "from-fuchsia-500/30 to-fuchsia-500/0",
  },
  {
    href: "/ear",
    icon: Ear,
    title: "Entrenamiento de oído",
    description:
      "Reconocimiento de intervalos, escalas menores y progresiones típicas de melodic techno.",
    level: "Cualquier nivel",
    accent: "from-cyan-500/30 to-cyan-500/0",
  },
  {
    href: "/arrange",
    icon: LayoutDashboard,
    title: "Arrangement Coach",
    description:
      "Plantilla de track de 7-8 minutos: intro, build, drop, breakdown. Aprende a estructurar.",
    level: "Nivel 2+",
    accent: "from-emerald-500/30 to-emerald-500/0",
  },
  {
    href: "/deconstruct",
    icon: ScanSearch,
    title: "Track Deconstructor",
    description:
      "Sube un track de Anyma, Tale of Us, Massano… analízalo por capas y recréalo paso a paso.",
    level: "Nivel 2+",
    accent: "from-amber-500/30 to-amber-500/0",
  },
  {
    href: "/challenges",
    icon: Trophy,
    title: "Retos semanales",
    description:
      "Brief con BPM, tonalidad y referencia. Subes tu loop y lo comparas con la referencia.",
    level: "Cuando quieras",
    accent: "from-violet-500/30 to-violet-500/0",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="container mx-auto px-4 py-12">
        <section className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            techno · melodic techno
          </p>
          <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-6xl">
            Aprende a producir{" "}
            <span className="text-primary">haciendo</span>, no leyendo.
          </h1>
          <p className="mt-6 text-pretty text-lg text-muted-foreground">
            Seis módulos interactivos para llevarte de cero a tu primer track:
            groove, sound design, oído, arreglo y deconstrucción de referencias.
            Suena en tu navegador desde el primer minuto.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/groove">
                Empezar con Groove Lab
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/ear">Probar oído</Link>
            </Button>
          </div>
        </section>

        <section className="mx-auto mt-20 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <Link key={m.href} href={m.href} className="group">
                <Card className="relative h-full overflow-hidden transition-colors hover:border-primary/40">
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${m.accent} opacity-0 transition-opacity group-hover:opacity-100`}
                  />
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        {m.level}
                      </span>
                    </div>
                    <CardTitle className="mt-4 text-lg">{m.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {m.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </section>

        <section className="mx-auto mt-24 max-w-3xl text-center text-sm text-muted-foreground">
          <p>
            Diseñado para Ableton Live · Inspirado en Anyma, Tale of Us, Mind
            Against, Massano, Stephan Bodzin, Innellea.
          </p>
        </section>
      </main>
    </>
  );
}
