"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Clock } from "lucide-react";
import { toast } from "sonner";
import type { Block, Lesson } from "@/lib/curriculum/types";
import { ConceptBlock } from "./concept";
import { CheckBlock } from "./check";
import { AbletonStepsBlock } from "./ableton-steps";
import { PracticeComponent } from "./practice/registry";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LessonShell({
  lesson,
  block,
  prevLesson,
  nextLesson,
  initialCompleted,
}: {
  lesson: Lesson;
  block: Block;
  prevLesson?: Lesson;
  nextLesson?: Lesson;
  initialCompleted: boolean;
}) {
  const [completed, setCompleted] = useState(initialCompleted);

  function markComplete() {
    if (completed) return;
    setCompleted(true);
    toast.success("Lección completada", {
      description: `${lesson.title} — sigue al siguiente paso.`,
    });
    fetch("/api/lessons/complete", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ lessonId: lesson.id }),
    }).catch(() => {});
  }

  return (
    <article className="space-y-6">
      {/* Breadcrumb + meta */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <Link
          href="/clases"
          className="font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          Curso
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="font-mono uppercase tracking-wider text-muted-foreground">
          {block.emoji} Bloque {block.id} — {block.title}
        </span>
        <span className="ml-auto flex items-center gap-1 font-mono text-muted-foreground">
          <Clock className="h-3 w-3" />
          {lesson.duration}
        </span>
      </div>

      <header>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
          Lección {lesson.order} / 70
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          {lesson.title}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">{lesson.summary}</p>
      </header>

      {lesson.concept && (
        <section>
          <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-primary">
            Concepto
          </h3>
          <ConceptBlock text={lesson.concept} />
        </section>
      )}

      {lesson.practice && (
        <section>
          <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-primary">
            Práctica
          </h3>
          <p className="mb-3 text-sm text-muted-foreground">
            {lesson.practice.instruction}
          </p>
          <PracticeComponent
            componentId={lesson.practice.componentId}
            props={lesson.practice.props}
          />
        </section>
      )}

      {lesson.abletonSteps && lesson.abletonSteps.length > 0 && (
        <AbletonStepsBlock steps={lesson.abletonSteps} />
      )}

      {lesson.check && (
        <section>
          <CheckBlock check={lesson.check} onCorrect={markComplete} />
        </section>
      )}

      {/* Mark complete fallback */}
      {!lesson.check && !completed && (
        <Button onClick={markComplete}>
          <Check />
          Marcar como completada
        </Button>
      )}

      {/* Navigation */}
      <nav className="flex items-center justify-between gap-3 border-t border-border pt-6">
        {prevLesson ? (
          <Button asChild variant="outline">
            <Link href={`/clases/${prevLesson.id}`}>
              <ArrowLeft />
              <span className="hidden sm:inline">{prevLesson.title}</span>
              <span className="sm:hidden">Anterior</span>
            </Link>
          </Button>
        ) : (
          <span />
        )}

        <span
          className={cn(
            "font-mono text-xs uppercase tracking-wider",
            completed ? "text-emerald-400" : "text-muted-foreground",
          )}
        >
          {completed ? "✓ Completada" : "Pendiente"}
        </span>

        {nextLesson ? (
          <Button asChild>
            <Link href={`/clases/${nextLesson.id}`}>
              <span className="hidden sm:inline">{nextLesson.title}</span>
              <span className="sm:hidden">Siguiente</span>
              <ArrowRight />
            </Link>
          </Button>
        ) : (
          <Button asChild variant="secondary">
            <Link href="/clases">Volver al curso</Link>
          </Button>
        )}
      </nav>
    </article>
  );
}
