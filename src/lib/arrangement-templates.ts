export type SectionType =
  | "intro"
  | "build"
  | "drop"
  | "groove"
  | "breakdown"
  | "outro";

export interface Section {
  type: SectionType;
  bars: number;
  description: string;
  elements: string[]; // typical elements that play in this section
}

export interface ArrangementTemplate {
  id: string;
  name: string;
  vibe: string;
  bpm: number;
  totalBars: number;
  sections: Section[];
  notes: string;
}

const SECTION_COLORS: Record<SectionType, string> = {
  intro: "bg-cyan-500/40 border-cyan-400",
  build: "bg-amber-500/40 border-amber-400",
  drop: "bg-rose-500/50 border-rose-400",
  groove: "bg-violet-500/40 border-violet-400",
  breakdown: "bg-emerald-500/40 border-emerald-400",
  outro: "bg-zinc-500/40 border-zinc-400",
};

const SECTION_LABEL: Record<SectionType, string> = {
  intro: "Intro",
  build: "Build",
  drop: "Drop",
  groove: "Groove",
  breakdown: "Breakdown",
  outro: "Outro",
};

export const SECTION_META = { color: SECTION_COLORS, label: SECTION_LABEL };

export const ARRANGEMENT_TEMPLATES: ArrangementTemplate[] = [
  {
    id: "classic-techno",
    name: "Classic Techno",
    vibe: "Peak-time, hipnótico, lineal",
    bpm: 130,
    totalBars: 192, // ~6 min @ 130 BPM
    notes:
      "Estructura lineal: el groove crece y mengua en lugar de tener un drop fuerte. Pensado para que el DJ pueda mezclar en cualquier sección.",
    sections: [
      {
        type: "intro",
        bars: 32,
        description: "DJ tools: solo kick + perc loop. Mezclable.",
        elements: ["Kick", "Hat", "Perc"],
      },
      {
        type: "groove",
        bars: 32,
        description: "Entra el bass loop y un elemento atmosférico.",
        elements: ["Kick", "Hat", "Perc", "Bass", "Atmósfera"],
      },
      {
        type: "build",
        bars: 16,
        description: "Filter sweep, riser y rim/clap entrando.",
        elements: ["Kick", "Hat", "Perc", "Bass", "Riser", "Clap"],
      },
      {
        type: "drop",
        bars: 32,
        description: "Tutti: lead/stab principal + todo lo anterior.",
        elements: [
          "Kick",
          "Hat",
          "Clap",
          "Bass",
          "Lead",
          "Atmósfera",
          "Perc",
        ],
      },
      {
        type: "breakdown",
        bars: 32,
        description: "Quita el kick, deja la melodía y un poco de aire.",
        elements: ["Lead", "Pad", "Reverb tail"],
      },
      {
        type: "drop",
        bars: 32,
        description: "Vuelve el kick, suma una variación rítmica.",
        elements: ["Kick", "Bass", "Hat", "Lead", "Clap", "Perc"],
      },
      {
        type: "outro",
        bars: 16,
        description: "Quita capas progresivamente, deja kick + perc para mezclar.",
        elements: ["Kick", "Perc"],
      },
    ],
  },
  {
    id: "melodic-breakdown",
    name: "Melodic Techno (breakdown-driven)",
    vibe: "Anyma, Tale of Us, emocional con gran momento melódico",
    bpm: 124,
    totalBars: 224,
    notes:
      "El corazón es el breakdown largo y emocional. El segundo drop suma capas y eleva.",
    sections: [
      {
        type: "intro",
        bars: 16,
        description: "Pad + atmósfera. Crea el universo emocional.",
        elements: ["Pad", "Atmósfera", "FX"],
      },
      {
        type: "groove",
        bars: 32,
        description: "Entra kick + bass + perc. Tu ‘main groove’.",
        elements: ["Kick", "Bass", "Perc", "Pad"],
      },
      {
        type: "build",
        bars: 16,
        description: "Riser, snare roll, hats en 16ths.",
        elements: ["Kick", "Bass", "Perc", "Hat 16ths", "Riser"],
      },
      {
        type: "drop",
        bars: 32,
        description: "Stab/pluck principal entra. Nada todavía over the top.",
        elements: ["Kick", "Bass", "Hat", "Clap", "Pluck", "Pad"],
      },
      {
        type: "breakdown",
        bars: 48,
        description:
          "El momento. Kick fuera, melodía protagonista, sub-pad creciendo. Aquí es donde la gente se emociona.",
        elements: ["Lead emocional", "Pad", "Sub", "Vocal chops"],
      },
      {
        type: "drop",
        bars: 48,
        description: "Tutti final con todas las capas + arp encima.",
        elements: [
          "Kick",
          "Bass",
          "Hat",
          "Clap",
          "Pluck",
          "Lead",
          "Pad",
          "Arp",
        ],
      },
      {
        type: "outro",
        bars: 32,
        description: "Quita melodía y deja el groove para mezclar.",
        elements: ["Kick", "Bass", "Perc"],
      },
    ],
  },
  {
    id: "hypnotic",
    name: "Hypnotic Techno",
    vibe: "Massano, Innellea — repetitivo, que crece a cuentagotas",
    bpm: 132,
    totalBars: 256,
    notes:
      "Cambios sutiles cada 16 compases. El truco está en restar tanto como sumas. La gente se hipnotiza.",
    sections: [
      {
        type: "intro",
        bars: 32,
        description: "Loop arpegio + hat. Sin kick.",
        elements: ["Arp", "Hat"],
      },
      {
        type: "groove",
        bars: 32,
        description: "Kick + sub. El arp sigue corriendo.",
        elements: ["Kick", "Sub", "Arp", "Hat"],
      },
      {
        type: "groove",
        bars: 32,
        description: "Suma perc y un pad lejano.",
        elements: ["Kick", "Sub", "Arp", "Hat", "Perc", "Pad"],
      },
      {
        type: "build",
        bars: 16,
        description: "Filter sweep al arp, aumenta resonancia.",
        elements: ["Kick", "Sub", "Arp filtrado", "Hat", "Perc"],
      },
      {
        type: "drop",
        bars: 32,
        description: "Lead corto + clap. Misma fórmula, más densa.",
        elements: ["Kick", "Sub", "Arp", "Hat", "Clap", "Perc", "Lead"],
      },
      {
        type: "breakdown",
        bars: 32,
        description: "Quita kick. El arp y el pad cuentan la historia.",
        elements: ["Arp", "Pad", "FX"],
      },
      {
        type: "drop",
        bars: 48,
        description: "Vuelve todo + variación del arp.",
        elements: [
          "Kick",
          "Sub",
          "Arp v2",
          "Hat",
          "Clap",
          "Perc",
          "Lead",
          "Pad",
        ],
      },
      {
        type: "outro",
        bars: 32,
        description: "Resta capas. Deja arp + hat al final.",
        elements: ["Arp", "Hat"],
      },
    ],
  },
];
