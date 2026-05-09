import { SiteHeader } from "@/components/site-header";
import { ChallengeCard } from "@/components/challenges/challenge-card";
import { getCurrentChallenge, getUpcoming } from "@/lib/challenges";

export const metadata = {
  title: "Retos semanales — MusicTrainer",
  description: "Brief semanal con BPM, tonalidad y referencia.",
};

export default function ChallengesPage() {
  const current = getCurrentChallenge();
  const upcoming = getUpcoming();

  return (
    <>
      <SiteHeader />
      <main className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-4xl space-y-10">
          <header>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
              módulo 06 · retos
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Retos semanales
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Cada semana, un brief concreto: BPM, tonalidad, referencia y un
              checklist claro de lo que tu loop debe tener. Sin tutorial — solo
              el reto y tú.
            </p>
          </header>

          <section className="space-y-4">
            <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Reto de esta semana
            </h2>
            <ChallengeCard challenge={current} active />
          </section>

          <section className="space-y-4">
            <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Próximas semanas
            </h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {upcoming.map((c) => (
                <ChallengeCard key={c.weekLabel} challenge={c} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
