import "server-only";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { sessions } from "@/lib/db/schema";

const COOKIE_NAME = "mt_session";
const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Returns the current anonymous session id, creating a new row + setting the
 * cookie on first visit. Safe to call from any Route Handler / Server Action.
 */
export async function getOrCreateSessionId(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(COOKIE_NAME)?.value;
  if (existing) {
    // Touch lastSeenAt — fire and forget
    db.update(sessions)
      .set({ lastSeenAt: new Date() })
      .where(eq(sessions.id, existing))
      .catch((e) => console.error("[session] touch failed", e));
    return existing;
  }

  const [row] = await db.insert(sessions).values({}).returning({ id: sessions.id });
  jar.set(COOKIE_NAME, row.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ONE_YEAR,
  });
  return row.id;
}

export async function getSessionId(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(COOKIE_NAME)?.value ?? null;
}
