import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { earStreaks } from "@/lib/db/schema";
import { getOrCreateSessionId } from "@/lib/session";

export const dynamic = "force-dynamic";

const Body = z.object({
  mode: z.enum(["interval", "scale", "progression"]),
  correct: z.boolean(),
  currentStreak: z.number().int().min(0),
});

export async function POST(req: Request) {
  try {
    const sessionId = await getOrCreateSessionId();
    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid body" }, { status: 400 });
    }
    const { mode, correct, currentStreak } = parsed.data;

    const [row] = await db
      .select()
      .from(earStreaks)
      .where(and(eq(earStreaks.sessionId, sessionId), eq(earStreaks.mode, mode)))
      .limit(1);

    if (!row) {
      const [created] = await db
        .insert(earStreaks)
        .values({
          sessionId,
          mode,
          bestStreak: currentStreak,
          totalAttempts: 1,
          totalCorrect: correct ? 1 : 0,
        })
        .returning();
      return NextResponse.json({ best: created.bestStreak });
    }

    await db
      .update(earStreaks)
      .set({
        bestStreak: Math.max(row.bestStreak, currentStreak),
        totalAttempts: row.totalAttempts + 1,
        totalCorrect: row.totalCorrect + (correct ? 1 : 0),
        updatedAt: new Date(),
      })
      .where(eq(earStreaks.id, row.id));

    return NextResponse.json({
      best: Math.max(row.bestStreak, currentStreak),
    });
  } catch (e) {
    console.error("[api/ear/streak] failed", e);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const sessionId = await getOrCreateSessionId();
    const rows = await db
      .select()
      .from(earStreaks)
      .where(eq(earStreaks.sessionId, sessionId));
    return NextResponse.json({
      streaks: Object.fromEntries(rows.map((r) => [r.mode, r.bestStreak])),
    });
  } catch (e) {
    console.error("[api/ear/streak GET] failed", e);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
