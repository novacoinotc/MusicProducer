import Link from "next/link";
import { headers } from "next/headers";
import { Check, Lock } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { AudioStatus } from "@/components/audio-status";
import {
  BLOCKS,
  LESSONS,
  getLessonsForBlock,
} from "@/lib/curriculum/data";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Curso completo — MusicTrainer",
  description:
    "70 lecciones para aprender a producir techno, melodic techno, progressive y todas sus variantes desde cero.",
};

async function getCompletedSet(): Promise<Set<string>> {
  try {
    const h = await headers();
    const host = h.get("host");
    const proto = h.get("x-forwarded-proto") ?? "http";
    if (!host) return new Set();
    const cookieHeader = h.get("cookie") ?? "";
    const res = await fetch(`${proto}://${host}/api/lessons/complete`, {
      headers: { cookie: cookieHeader },
      cache: "no-store",
    });
    if (!res.ok) return new Set();
    const j = (await res.json()) as { completed: string[] };
    return new Set(j.completed);
  } catch {
    return new Set();
  }
}

export default async function CoursePage() {
  const completed = await getCompletedSet();
  const totalDone = LESSONS.filter((l) => completed.has(l.id)).length;
  const pct = Math.round((totalDone / LESSONS.length) * 100);
  const nextLesson =
    LESSONS.find((l) => !completed.has(l.id)) ?? LESSONS[0];

  return (
    <>
      <SiteHeader />
      <main className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-4xl space-y-10">
          <header>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
              curso completo · 70 lecciones
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
              De cero a producir tu primer track
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              Techno y todas sus variantes (melodic, progressive, hipnótico,
              hard, peak-time). Sin paja, sin jerga sin explicar. Cada lección
              es una idea + práctica + check.
            </p>
          </header>

          {/* Audio diagnostic */}
          <AudioStatus />

          {/* Progress */}
          <section className="rounded-xl border bg-card p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Tu progreso</h2>
                <p className="text-sm text-muted-foreground">
                  {totalDone} de {LESSONS.length} lecciones · {pct}%
                </p>
              </div>
              <Link
                href={`/clases/${nextLesson.id}`}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                {totalDone === 0
                  ? "Empezar el curso"
                  : `Continuar — Lección ${nextLesson.order}`}
              </Link>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </section>

          {/* Blocks */}
          <section className="space-y-6">
            {BLOCKS.map((block) => {
              const lessons = getLessonsForBlock(block.id);
              const blockDone = lessons.filter((l) => completed.has(l.id)).length;
              return (
                <div
                  key={block.id}
                  className="rounded-xl border bg-card overflow-hidden"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border/60 p-5">
                    <div>
                      <h3 className="text-xl font-semibold">
                        <span className="mr-2">{block.emoji}</span>
                        Bloque {block.id} — {block.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {block.subtitle}
                      </p>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground tabular-nums">
                      {blockDone}/{lessons.length} completadas
                    </span>
                  </div>

                  <div className="divide-y divide-border/40">
                    {lessons.map((l) => {
                      const isDone = completed.has(l.id);
                      return (
                        <Link
                          key={l.id}
                          href={`/clases/${l.id}`}
                          className={cn(
                            "flex items-center gap-3 px-5 py-3 transition-colors hover:bg-secondary/40",
                            isDone && "bg-emerald-500/5",
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[10px]",
                              isDone
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-secondary text-muted-foreground",
                            )}
                          >
                            {isDone ? <Check className="h-3 w-3" /> : l.order}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{l.title}</span>
                              {!l.implemented && (
                                <Lock className="h-3 w-3 text-muted-foreground" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {l.summary}
                            </p>
                          </div>
                          <span className="ml-auto shrink-0 font-mono text-[10px] text-muted-foreground">
                            {l.duration}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      </main>
    </>
  );
}
