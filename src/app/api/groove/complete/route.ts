import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { moduleProgress } from "@/lib/db/schema";
import { getOrCreateSessionId } from "@/lib/session";

export const dynamic = "force-dynamic";

const Body = z.object({
  lessonId: z.string().min(1).max(64),
});

export async function POST(req: Request) {
  try {
    const sessionId = await getOrCreateSessionId();
    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid body" }, { status: 400 });
    }
    const { lessonId } = parsed.data;

    const [existing] = await db
      .select()
      .from(moduleProgress)
      .where(
        and(
          eq(moduleProgress.sessionId, sessionId),
          eq(moduleProgress.module, "groove"),
          eq(moduleProgress.itemId, lessonId),
        ),
      )
      .limit(1);

    if (!existing) {
      await db.insert(moduleProgress).values({
        sessionId,
        module: "groove",
        itemId: lessonId,
        status: "completed",
      });
    } else if (existing.status !== "completed") {
      await db
        .update(moduleProgress)
        .set({ status: "completed", updatedAt: new Date() })
        .where(eq(moduleProgress.id, existing.id));
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/groove/complete] failed", e);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const sessionId = await getOrCreateSessionId();
    const rows = await db
      .select({ itemId: moduleProgress.itemId, status: moduleProgress.status })
      .from(moduleProgress)
      .where(
        and(
          eq(moduleProgress.sessionId, sessionId),
          eq(moduleProgress.module, "groove"),
        ),
      );
    return NextResponse.json({
      completed: rows.filter((r) => r.status === "completed").map((r) => r.itemId),
    });
  } catch (e) {
    console.error("[api/groove/complete GET] failed", e);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
