"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const Loading = () => (
  <div className="flex items-center justify-center gap-2 rounded-xl border bg-card p-10 text-sm text-muted-foreground">
    <Loader2 className="h-4 w-4 animate-spin" />
    Cargando…
  </div>
);

const FreqSlider = dynamic(() => import("./freq-slider"), { loading: Loading, ssr: false });
const OctaveKeys = dynamic(() => import("./octave-keys"), { loading: Loading, ssr: false });
const ModeAB = dynamic(() => import("./mode-ab"), { loading: Loading, ssr: false });
const TapTempo = dynamic(() => import("./tap-tempo"), { loading: Loading, ssr: false });
const ProgressionAB = dynamic(() => import("./progression-ab"), { loading: Loading, ssr: false });
const GoToLab = dynamic(() => import("./go-to-lab"), { loading: Loading, ssr: false });

export function PracticeComponent({
  componentId,
  props,
}: {
  componentId: string;
  props?: Record<string, unknown>;
}) {
  const passed = (props ?? {}) as Record<string, unknown>;
  switch (componentId) {
    case "freq-slider":
      return <FreqSlider />;
    case "octave-keys":
      return <OctaveKeys />;
    case "mode-ab":
      return <ModeAB />;
    case "tap-tempo":
      return <TapTempo />;
    case "progression-ab":
      return (
        <ProgressionAB
          progression={(passed.progression as string) ?? "i-VI-III-VII"}
        />
      );
    case "go-to-lab":
      return <GoToLab href={(passed.href as string) ?? "/groove"} />;
    default:
      return (
        <div className="rounded-xl border bg-card p-5 text-sm text-muted-foreground">
          Práctica ‘{componentId}’ aún no disponible. Completa el check para
          continuar.
        </div>
      );
  }
}
