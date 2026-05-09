export interface WeeklyChallenge {
  id: string;
  weekLabel: string;
  title: string;
  bpm: number;
  key: string;
  reference: string;
  brief: string;
  checklist: string[];
  difficulty: "Básico" | "Intermedio" | "Avanzado";
}

// Pool of reusable challenges. The "current week" is selected deterministically
// from the date, so the user sees a stable challenge each week without DB.
export const CHALLENGE_POOL: WeeklyChallenge[] = [
  {
    id: "loop-am-126",
    title: "16 compases en La menor a 126",
    weekLabel: "",
    bpm: 126,
    key: "A menor",
    reference: "Anyma — Eternity",
    difficulty: "Básico",
    brief:
      "Crea un loop de 16 compases que pueda funcionar como 'main groove' de un track de melodic techno.",
    checklist: [
      "Kick four-on-the-floor con sub-kick redondo",
      "Clap o snare en 2 y 4 (compases pares)",
      "Hat off-beat y un open hat de adorno",
      "Bassline en La menor (notas A, C, E, G principalmente)",
      "Pluck o stab que toque una progresión i–VI–III–VII",
      "Mix con un poco de sidechain en el pad/pluck",
    ],
  },
  {
    id: "loop-em-122",
    title: "Breakdown emocional en Mi menor",
    weekLabel: "",
    bpm: 122,
    key: "E menor",
    reference: "Tale of Us — Monument",
    difficulty: "Intermedio",
    brief:
      "Crea un breakdown de 32 compases sin kick. Pad + lead + sub. La meta: emocionar.",
    checklist: [
      "Pad largo en Mi menor con LFO suave al filtro",
      "Lead emocional siguiendo i–v–VI–iv",
      "Sub o sub-pad creciendo en los últimos 8 compases",
      "Reverb largo y delay 3/8 en el lead",
      "Vocal chop opcional como decoración",
      "Termina con un riser de 2 compases que lleve al drop",
    ],
  },
  {
    id: "loop-cm-130",
    title: "Hipnótico en Do menor a 130",
    weekLabel: "",
    bpm: 130,
    key: "C menor",
    reference: "Massano — The Feeling",
    difficulty: "Avanzado",
    brief:
      "32 compases hipnóticos. Cambios sutiles cada 16 compases. Resta tanto como sumas.",
    checklist: [
      "Loop de arpegio en Do menor (saw, decay corto)",
      "LFO al filtro del arp con rate ~0.5 Hz",
      "Kick + sub anclando, sin clap protagonista",
      "Una variación rítmica cada 16 compases",
      "Stab muy corto en off-beat de los compases 9-12",
      "Drive moderado, sidechain claro pero no dramático",
    ],
  },
  {
    id: "loop-fm-128",
    title: "Drop techno clásico en Fa menor",
    weekLabel: "",
    bpm: 128,
    key: "F menor",
    reference: "Charlotte de Witte — Doppler",
    difficulty: "Intermedio",
    brief:
      "32 compases de drop techno peak-time. Lineal, físico, hipnótico. Sin grandes melodías.",
    checklist: [
      "Kick punchy con poco sub, mucho ataque",
      "Hat en 16ths con swing 12-15%",
      "Clap saturado en 2 y 4",
      "Bass percusivo (no melódico) anclado a la fundamental",
      "Lead corto y disonante, casi de ruido",
      "Riser y filter sweep en los últimos 4 compases",
    ],
  },
  {
    id: "loop-gm-124",
    title: "Pluck arpegiado en Sol menor",
    weekLabel: "",
    bpm: 124,
    key: "G menor",
    reference: "Mind Against — Walking Away",
    difficulty: "Básico",
    brief:
      "16 compases con un arpegio que sea el protagonista. Limpio, brillante, melódico.",
    checklist: [
      "Pluck con square + triangle, decay rápido",
      "Arpegio de 8 notas en Sol menor (G–Bb–D + variaciones)",
      "Delay 3/8 con feedback medio",
      "Reverb 50%, hall largo",
      "Pad de fondo muy bajo (-18 dB)",
      "Kick four-on-the-floor para anclar",
    ],
  },
];

export function getCurrentChallenge(now = new Date()): WeeklyChallenge {
  // Week of the year (rough) → pick deterministically from pool.
  const start = new Date(now.getFullYear(), 0, 1);
  const day = Math.floor((now.getTime() - start.getTime()) / 86400000);
  const week = Math.floor(day / 7);
  const idx = week % CHALLENGE_POOL.length;
  const c = CHALLENGE_POOL[idx];
  return {
    ...c,
    weekLabel: `Semana ${week + 1} · ${now.getFullYear()}`,
  };
}

export function getUpcoming(now = new Date(), n = 3): WeeklyChallenge[] {
  const start = new Date(now.getFullYear(), 0, 1);
  const day = Math.floor((now.getTime() - start.getTime()) / 86400000);
  const week = Math.floor(day / 7);
  return Array.from({ length: n }, (_, i) => {
    const idx = (week + i + 1) % CHALLENGE_POOL.length;
    const c = CHALLENGE_POOL[idx];
    return {
      ...c,
      weekLabel: `Semana ${week + 1 + i + 1}`,
    };
  });
}
