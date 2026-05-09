import type { Pattern } from "@/lib/audio/sequencer";
import { VOICES } from "@/lib/audio/sequencer";
import type { DrumVoice } from "@/lib/audio/drum-kit";

export interface GrooveLesson {
  id: string;
  title: string;
  difficulty: "Básico" | "Intermedio" | "Avanzado";
  bpm: number;
  swing: number;
  description: string;
  hint: string;
  pattern: Pattern;
}

function makePattern(
  spec: Partial<Record<DrumVoice, number[]>>,
): Pattern {
  return Object.fromEntries(
    VOICES.map((v) => {
      const steps = spec[v] ?? [];
      const arr = Array(16).fill(false);
      steps.forEach((s) => {
        if (s >= 0 && s < 16) arr[s] = true;
      });
      return [v, arr];
    }),
  ) as Pattern;
}

export const GROOVE_LESSONS: GrooveLesson[] = [
  {
    id: "four-on-the-floor",
    title: "Four on the floor",
    difficulty: "Básico",
    bpm: 126,
    swing: 0,
    description:
      "El kick en cada negra. Es el latido del techno: estable, hipnótico, inevitable.",
    hint: "Pulsa los pasos 1, 5, 9 y 13 en la fila del KICK.",
    pattern: makePattern({ kick: [0, 4, 8, 12] }),
  },
  {
    id: "kick-clap",
    title: "Kick + clap (backbeat)",
    difficulty: "Básico",
    bpm: 126,
    swing: 0,
    description:
      "Suma claps en los tiempos 2 y 4. Te da el típico backbeat de techno y house.",
    hint: "Kick en 1,5,9,13. Clap en 5 y 13.",
    pattern: makePattern({
      kick: [0, 4, 8, 12],
      clap: [4, 12],
    }),
  },
  {
    id: "off-beat-hats",
    title: "Off-beat hats",
    difficulty: "Básico",
    bpm: 128,
    swing: 0,
    description:
      "Hats cerrados en las corcheas off-beat. La fórmula que da empuje al techno.",
    hint: "Hat cerrado en 3, 7, 11, 15.",
    pattern: makePattern({
      kick: [0, 4, 8, 12],
      clap: [4, 12],
      hat: [2, 6, 10, 14],
    }),
  },
  {
    id: "16-hats",
    title: "Hats en 16ths",
    difficulty: "Intermedio",
    bpm: 128,
    swing: 0.08,
    description:
      "Hats en cada semicorchea con un poco de swing. Energía constante con sensación humana.",
    hint: "Llena la fila del HAT y añade ~8% de swing.",
    pattern: makePattern({
      kick: [0, 4, 8, 12],
      clap: [4, 12],
      hat: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    }),
  },
  {
    id: "open-hat-tease",
    title: "Open hat en el &-de-4",
    difficulty: "Intermedio",
    bpm: 128,
    swing: 0,
    description:
      "Truco clásico: open hat justo antes del próximo kick. Crea tensión y groove.",
    hint: "Open hat en el paso 14 (la corchea entre el 4 y el 1).",
    pattern: makePattern({
      kick: [0, 4, 8, 12],
      clap: [4, 12],
      hat: [2, 6, 10],
      ohat: [14],
    }),
  },
  {
    id: "melodic-techno-groove",
    title: "Melodic techno groove",
    difficulty: "Avanzado",
    bpm: 122,
    swing: 0.12,
    description:
      "Más respirado, BPM más bajo, percusión sutil tipo Anyma / Mind Against. Espacio entre golpes.",
    hint: "Kick four-on-the-floor, clap solo en 13, perc fantasma y rim ocasional.",
    pattern: makePattern({
      kick: [0, 4, 8, 12],
      clap: [12],
      hat: [2, 6, 10, 14],
      ohat: [6],
      perc: [3, 11],
      rim: [7],
    }),
  },
];
