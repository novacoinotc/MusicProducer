"use client";

import { useState } from "react";
import { Check as CheckIcon, X } from "lucide-react";
import type { Check as CheckType } from "@/lib/curriculum/types";
import { cn } from "@/lib/utils";

export function CheckBlock({
  check,
  onCorrect,
}: {
  check: CheckType;
  onCorrect?: () => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (check.options[i].correct) onCorrect?.();
  }

  const correctIdx = check.options.findIndex((o) => o.correct);

  return (
    <div className="rounded-xl border bg-card p-5">
      <h4 className="font-mono text-[10px] uppercase tracking-wider text-primary">
        Check
      </h4>
      <p className="mt-2 text-base font-medium">{check.question}</p>

      <div className="mt-4 grid gap-2">
        {check.options.map((opt, i) => {
          const isPicked = picked === i;
          const isCorrect = opt.correct === true;
          const reveal = picked !== null;
          return (
            <button
              key={i}
              disabled={reveal}
              onClick={() => pick(i)}
              className={cn(
                "flex items-center justify-between rounded-md border bg-secondary/20 px-4 py-3 text-left text-sm transition-colors disabled:cursor-default",
                !reveal && "hover:bg-secondary",
                reveal &&
                  isCorrect &&
                  "border-emerald-500/60 bg-emerald-500/10",
                reveal &&
                  isPicked &&
                  !isCorrect &&
                  "border-rose-500/60 bg-rose-500/10",
              )}
            >
              <span>{opt.label}</span>
              {reveal && isCorrect && (
                <CheckIcon className="h-4 w-4 text-emerald-400" />
              )}
              {reveal && isPicked && !isCorrect && (
                <X className="h-4 w-4 text-rose-400" />
              )}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <div className="mt-4 rounded-md bg-background/50 p-3 text-sm">
          {picked === correctIdx ? (
            <p>
              <span className="font-semibold text-emerald-400">
                ¡Correcto!{" "}
              </span>
              {check.explanation}
            </p>
          ) : (
            <p>
              <span className="font-semibold text-rose-400">
                No exactamente.{" "}
              </span>
              La respuesta era:{" "}
              <span className="font-medium">
                {check.options[correctIdx]?.label}
              </span>
              {check.explanation && <span>. {check.explanation}</span>}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
