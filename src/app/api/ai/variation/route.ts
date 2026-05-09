import { NextResponse } from "next/server";
import { generateText, Output } from "ai";
import { z } from "zod";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const StepRow = z.array(z.boolean()).length(16);
const Pattern = z.object({
  kick: StepRow,
  clap: StepRow,
  hat: StepRow,
  ohat: StepRow,
  perc: StepRow,
  rim: StepRow,
});

const VariationSchema = z.object({
  variations: z
    .array(
      z.object({
        label: z.string(),
        pattern: Pattern,
      }),
    )
    .length(3),
});

const Body = z.object({
  pattern: Pattern,
  style: z
    .enum(["melodic", "hypnotic", "progressive", "peak-time", "hard"])
    .default("melodic"),
});

const SYSTEM = `You generate musical variations of a 16-step techno drum
pattern. Output exactly 3 variations.

Rules:
- Keep the kick four-on-the-floor unless the original deviates (steps 0,4,8,12 active).
- Variations should differ from the original AND from each other.
- Variation 1: subtle (add 1-2 perc/hat hits)
- Variation 2: moderate (change hat density, add open hat or clap)
- Variation 3: contrast (more open structure or sparse) — could remove clap on one beat
- Keep all rows length 16.
- Hypnotic style: minimal changes, mostly perc-driven.
- Melodic / progressive: more open hats, ghost claps.
- Hard / peak-time: more aggressive — extra claps, rim, busy hats.
- Each "label" should be a short Spanish phrase describing the variation.`;

export async function POST(req: Request) {
  try {
    const parsed = Body.safeParse(await req.json().catch(() => ({})));
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid body" }, { status: 400 });
    }
    const { pattern, style } = parsed.data;

    const userPrompt = `Style: ${style}.\n\nOriginal pattern (rows of 16 booleans):\n${JSON.stringify(pattern)}\n\nReturn 3 variations.`;

    const result = await generateText({
      model: "anthropic/claude-haiku-4.5",
      output: Output.object({ schema: VariationSchema }),
      system: SYSTEM,
      prompt: userPrompt,
      temperature: 0.8,
    });

    return NextResponse.json({ variations: result.output.variations });
  } catch (e) {
    console.error("[api/ai/variation] failed", e);
    const message = e instanceof Error ? e.message : "internal";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
