import type { AbletonStep } from "@/lib/curriculum/types";

export function AbletonStepsBlock({ steps }: { steps: AbletonStep[] }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <h4 className="font-mono text-[10px] uppercase tracking-wider text-primary">
        Pasos en Ableton
      </h4>
      <ol className="mt-3 space-y-3">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 font-mono text-xs text-primary">
              {i + 1}
            </span>
            <div className="flex-1">
              <p className="text-sm">{s.text}</p>
              {s.shortcut && (
                <kbd className="mt-1 inline-block rounded bg-secondary px-2 py-0.5 font-mono text-[10px] text-foreground/80">
                  {s.shortcut}
                </kbd>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
