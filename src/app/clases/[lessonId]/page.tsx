import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { SiteHeader } from "@/components/site-header";
import { LessonShell } from "@/components/lesson/lesson-shell";
import {
  getBlock,
  getLesson,
  getNextLesson,
  getPrevLesson,
} from "@/lib/curriculum/data";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ lessonId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { lessonId } = await params;
  const lesson = getLesson(lessonId);
  if (!lesson) return { title: "Lección no encontrada" };
  return {
    title: `${lesson.title} — MusicTrainer`,
    description: lesson.summary,
  };
}

export default async function LessonPage({ params }: PageProps) {
  const { lessonId } = await params;
  const lesson = getLesson(lessonId);
  if (!lesson) notFound();

  const block = getBlock(lesson.blockId);
  if (!block) notFound();

  const prevLesson = getPrevLesson(lesson.id);
  const nextLesson = getNextLesson(lesson.id);

  // Read current completion (server-side; cookies are accessible here)
  let initialCompleted = false;
  try {
    const h = await headers();
    const host = h.get("host");
    const proto = h.get("x-forwarded-proto") ?? "http";
    if (host) {
      const cookieHeader = h.get("cookie") ?? "";
      const res = await fetch(`${proto}://${host}/api/lessons/complete`, {
        headers: { cookie: cookieHeader },
        cache: "no-store",
      });
      if (res.ok) {
        const j = (await res.json()) as { completed: string[] };
        initialCompleted = j.completed.includes(lesson.id);
      }
    }
  } catch {
    // best-effort; UI stays functional even if this fails
  }

  return (
    <>
      <SiteHeader />
      <main className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <LessonShell
            lesson={lesson}
            block={block}
            prevLesson={prevLesson}
            nextLesson={nextLesson}
            initialCompleted={initialCompleted}
          />
        </div>
      </main>
    </>
  );
}
