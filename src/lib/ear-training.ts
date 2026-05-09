import { Note, Interval, Scale } from "tonal";

export interface IntervalQuestion {
  kind: "interval";
  notes: [string, string];
  answer: string; // e.g. "5P"
  options: { value: string; label: string }[];
}

export interface ScaleQuestion {
  kind: "scale";
  tonic: string;
  notes: string[];
  answer: string; // scale name
  options: { value: string; label: string }[];
}

export interface ProgressionQuestion {
  kind: "progression";
  key: string; // e.g. "A minor"
  chords: string[][]; // arrays of note names per chord
  romans: string[];
  answer: string; // joined romans like "i-VI-III-VII"
  options: { value: string; label: string }[];
}

const INTERVAL_POOL: { value: string; label: string; semitones: number }[] = [
  { value: "2m", label: "2ª menor", semitones: 1 },
  { value: "2M", label: "2ª mayor", semitones: 2 },
  { value: "3m", label: "3ª menor", semitones: 3 },
  { value: "3M", label: "3ª mayor", semitones: 4 },
  { value: "4P", label: "4ª justa", semitones: 5 },
  { value: "5P", label: "5ª justa", semitones: 7 },
  { value: "6m", label: "6ª menor", semitones: 8 },
  { value: "6M", label: "6ª mayor", semitones: 9 },
  { value: "7m", label: "7ª menor", semitones: 10 },
  { value: "8P", label: "8ª (octava)", semitones: 12 },
];

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const ROOTS = ["C3", "D3", "E3", "F3", "G3", "A3"];

export function generateIntervalQuestion(): IntervalQuestion {
  const root = pick(ROOTS);
  const target = pick(INTERVAL_POOL);
  const upper = Note.transpose(root, Interval.fromSemitones(target.semitones));
  return {
    kind: "interval",
    notes: [root, upper],
    answer: target.value,
    options: INTERVAL_POOL.map((i) => ({ value: i.value, label: i.label })),
  };
}

const SCALE_POOL = [
  { name: "minor", label: "Menor natural (Aeolian)" },
  { name: "dorian", label: "Dorian" },
  { name: "phrygian", label: "Phrygian" },
  { name: "harmonic minor", label: "Menor armónica" },
  { name: "major", label: "Mayor (Ionian)" },
] as const;

const SCALE_TONICS = ["C", "D", "E", "F", "G", "A"];

export function generateScaleQuestion(): ScaleQuestion {
  const tonic = pick(SCALE_TONICS);
  const target = pick(SCALE_POOL);
  const scale = Scale.get(`${tonic} ${target.name}`);
  const notes = scale.notes.map((n) => `${n}3`);
  notes.push(`${tonic}4`); // close with the octave
  return {
    kind: "scale",
    tonic,
    notes,
    answer: target.name,
    options: SCALE_POOL.map((s) => ({ value: s.name, label: s.label })),
  };
}

// Common minor-key progressions used in melodic techno
const MINOR_PROGRESSIONS: { romans: string[]; description: string }[] = [
  { romans: ["i", "VI", "III", "VII"], description: "Épica clásica (Anyma, Tale of Us)" },
  { romans: ["i", "iv", "VI", "V"], description: "Tensión clásica" },
  { romans: ["i", "VII", "VI", "VII"], description: "Bajada y subida" },
  { romans: ["i", "v", "VI", "iv"], description: "Sad melodic techno" },
  { romans: ["i", "III", "VI", "VII"], description: "Innellea / Massano" },
  { romans: ["i", "iv", "v", "i"], description: "Mínima clásica" },
];

const KEY_TONICS = ["C", "D", "E", "F", "G", "A"];

function chordFromRoman(roman: string, keyTonic: string): string[] {
  // Build chord from a roman numeral relative to the natural minor scale of keyTonic
  const minorScale = Scale.get(`${keyTonic} minor`).notes; // 7 notes
  // map roman to scale degree (1..7)
  const lookup: Record<string, { degree: number; quality: "min" | "maj" | "dim" }> = {
    i: { degree: 1, quality: "min" },
    ii: { degree: 2, quality: "dim" },
    III: { degree: 3, quality: "maj" },
    iv: { degree: 4, quality: "min" },
    v: { degree: 5, quality: "min" },
    V: { degree: 5, quality: "maj" },
    VI: { degree: 6, quality: "maj" },
    VII: { degree: 7, quality: "maj" },
  };
  const { degree, quality } = lookup[roman];
  const root = minorScale[degree - 1];
  const third = quality === "min" ? "3m" : "3M";
  const fifth = quality === "dim" ? "5d" : "5P";
  const rootOct = `${root}3`;
  const thirdN = Note.transpose(rootOct, third as ReturnType<typeof Interval.fromSemitones>);
  const fifthN = Note.transpose(rootOct, fifth as ReturnType<typeof Interval.fromSemitones>);
  return [rootOct, thirdN, fifthN];
}

export function generateProgressionQuestion(): ProgressionQuestion {
  const tonic = pick(KEY_TONICS);
  const target = pick(MINOR_PROGRESSIONS);
  const chords = target.romans.map((r) => chordFromRoman(r, tonic));
  const allOptions = MINOR_PROGRESSIONS.map((p) => ({
    value: p.romans.join("-"),
    label: `${p.romans.join(" – ")}  ·  ${p.description}`,
  }));
  return {
    kind: "progression",
    key: `${tonic} menor`,
    chords,
    romans: target.romans,
    answer: target.romans.join("-"),
    options: allOptions,
  };
}

export type EarQuestion =
  | IntervalQuestion
  | ScaleQuestion
  | ProgressionQuestion;
