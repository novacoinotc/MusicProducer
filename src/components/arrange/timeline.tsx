"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ARRANGEMENT_TEMPLATES,
  SECTION_META,
  type ArrangementTemplate,
} from "@/lib/arrangement-templates";

export function ArrangementTimeline() {
  const [tplId, setTplId] = useState(ARRANGEMENT_TEMPLATES[0].id);
  const [selected, setSelected] = useState<number | null>(null);
  const tpl =
    ARRANGEMENT_TEMPLATES.find((t) => t.id === tplId) ??
    ARRANGEMENT_TEMPLATES[0];

  const totalBars = tpl.sections.reduce((acc, s) => acc + s.bars, 0);
  const totalMin = (totalBars * 4 * 60) / tpl.bpm / 60;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {ARRANGEMENT_TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setTplId(t.id);
              setSelected(null);
            }}
            className={cn(
              "rounded-md border px-3 py-1.5 text-left transition-colors",
              tplId === t.id
                ? "border-primary/60 bg-primary/10"
                : "border-border bg-card hover:bg-secondary",
            )}
          >
            <span className="block font-medium">{t.name}</span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {t.bpm} BPM · {t.vibe}
            </span>
          </button>
        ))}
      </div>

      <div className="rounded-xl border bg-card p-5">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-semibold">{tpl.name}</h3>
          <span className="font-mono text-xs text-muted-foreground">
            {totalBars} compases · {totalMin.toFixed(1)} min · {tpl.bpm} BPM
          </span>
        </div>

        {/* Timeline */}
        <div className="overflow-x-auto">
          <div className="relative h-20 min-w-[800px] overflow-hidden rounded-md border bg-secondary/20">
            {/* Bar grid */}
            <div className="absolute inset-0 grid grid-cols-16 opacity-20">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="border-l border-border/40" />
              ))}
            </div>

            {/* Sections */}
            <div className="flex h-full">
              {tpl.sections.map((s, i) => {
                const widthPct = (s.bars / totalBars) * 100;
                return (
                  <button
                    key={i}
                    onClick={() => setSelected(i === selected ? null : i)}
                    className={cn(
                      "group relative h-full border-r border-background/20 transition-all",
                      SECTION_META.color[s.type],
                      selected === i && "ring-2 ring-primary",
                    )}
                    style={{ width: `${widthPct}%` }}
                  >
                    <div className="flex h-full flex-col items-start justify-between p-2 text-left">
                      <span className="font-mono text-[10px] font-semibold uppercase tracking-wider">
                        {SECTION_META.label[s.type]}
                      </span>
                      <span className="font-mono text-[10px] text-foreground/70">
                        {s.bars} bars
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bar ruler */}
          <div className="mt-2 flex font-mono text-[9px] text-muted-foreground">
            {tpl.sections.reduce<{ bar: number; els: React.ReactNode[] }>(
              (acc, s, i) => {
                acc.els.push(
                  <div
                    key={i}
                    style={{ width: `${(s.bars / totalBars) * 100}%` }}
                    className="border-l border-border/30 pl-1"
                  >
                    {acc.bar + 1}
                  </div>,
                );
                acc.bar += s.bars;
                return acc;
              },
              { bar: 0, els: [] },
            ).els}
          </div>
        </div>

        {/* Section detail */}
        {selected !== null && (
          <div className="mt-5 rounded-lg border border-primary/30 bg-primary/5 p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-mono text-xs uppercase tracking-wider text-primary">
                {SECTION_META.label[tpl.sections[selected].type]} ·{" "}
                {tpl.sections[selected].bars} compases
              </h4>
              <span className="font-mono text-[10px] text-muted-foreground">
                ~{(
                  (tpl.sections[selected].bars * 4 * 60) /
                  tpl.bpm
                ).toFixed(0)}
                s
              </span>
            </div>
            <p className="mt-2 text-sm">
              {tpl.sections[selected].description}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tpl.sections[selected].elements.map((el) => (
                <span
                  key={el}
                  className="rounded-md bg-background/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-foreground/80"
                >
                  {el}
                </span>
              ))}
            </div>
          </div>
        )}

        <p className="mt-4 text-sm text-muted-foreground">{tpl.notes}</p>
      </div>
    </div>
  );
}
