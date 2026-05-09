import { NextResponse } from "next/server";
import { generateText, Output } from "ai";
import { z } from "zod";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const RiffSchema = z.object({
  notes: z.array(z.string()).length(8),
  description: z.string(),
});

const Body = z.object({
  key: z.string().default("A minor"),
  style: z
    .enum(["melodic", "hypnotic", "progressive", "peak-time"])
    .default("melodic"),
  bpm: z.number().min(80).max(160).default(124),
  vibe: z.string().max(160).optional(),
});

const SYSTEM = `You write 8-note arpeggios for techno music.
- All notes must belong to the natural minor scale of the requested key (or
  dorian/phrygian if the style suggests it — hypnotic often uses phrygian).
- Octaves between 2 and 4. Mix octaves to create interest.
- Avoid landing on the same note twice in a row.
- Hypnotic style: simpler, repetitive, mostly within one octave.
- Melodic style: spans 1.5-2 octaves, emotional contour.
- Progressive style: lots of arpeggio movement, 4-5 different notes.
- Peak-time style: shorter range, more rhythmic, heavy on the root.
- You may use "_" for a rest at most twice in 8 notes.
- Return notes in scientific pitch notation (e.g., C3, Eb3, F#4).
- The "description" must be one short sentence in Spanish about the riff vibe.`;

export async function POST(req: Request) {
  try {
    const parsed = Body.safeParse(await req.json().catch(() => ({})));
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid body" }, { status: 400 });
    }
    const { key, style, bpm, vibe } = parsed.data;

    const userPrompt =
      `Generate an 8-note arpeggio in ${key} for ${style} techno at ${bpm} BPM.` +
      (vibe ? ` Vibe: ${vibe}.` : "");

    const result = await generateText({
      model: "anthropic/claude-haiku-4.5",
      output: Output.object({ schema: RiffSchema }),
      system: SYSTEM,
      prompt: userPrompt,
      temperature: 0.9,
    });

    return NextResponse.json({ riff: result.output });
  } catch (e) {
    console.error("[api/ai/riff] failed", e);
    const message = e instanceof Error ? e.message : "internal";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
