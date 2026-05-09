export type LessonKind =
  | "theory" // concept + check, no hands-on practice
  | "practice" // hands-on with a mini practice component
  | "ableton" // step-by-step instructions for Ableton
  | "milestone"; // recap / celebration

export interface CheckOption {
  label: string;
  correct?: boolean;
}

export interface Check {
  question: string;
  // For "mcq": user picks the correct option
  options: CheckOption[];
  // Optional explanation shown after answering
  explanation?: string;
}

export interface AbletonStep {
  text: string;
  shortcut?: string;
}

export interface PracticeRef {
  // Component key registered in src/components/lesson/practice/registry.ts
  componentId: string;
  // Free-form props passed to the practice component
  props?: Record<string, unknown>;
  // Instruction shown above the practice
  instruction: string;
}

export interface Lesson {
  id: string; // e.g. "01-01"
  blockId: string; // e.g. "01"
  order: number; // global order in the course
  title: string;
  summary: string; // 1-line description
  duration: string; // e.g. "5 min"
  kind: LessonKind;
  // Optional rich content
  concept?: string; // markdown-ish text, sentences
  practice?: PracticeRef;
  abletonSteps?: AbletonStep[];
  check?: Check;
  // Flags
  implemented?: boolean; // true if fully built; false = stub
}

export interface Block {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
}
