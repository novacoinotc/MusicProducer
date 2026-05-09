import { cn } from "@/lib/utils";

/**
 * Render a lesson "concept" string. We use a tiny markdown-ish parser:
 * - Lines starting with "**" wrapped become bold inline
 * - Lines starting with "- " become list items
 * - Blank lines separate paragraphs
 */
export function ConceptBlock({ text }: { text: string }) {
  const blocks = text.split(/\n\n+/);
  return (
    <div className={cn("space-y-4 text-base leading-relaxed")}>
      {blocks.map((b, i) => {
        const lines = b.split("\n");
        const isList = lines.every((line) => line.trim().startsWith("- "));
        if (isList) {
          return (
            <ul key={i} className="list-disc space-y-1 pl-5">
              {lines.map((line, j) => (
                <li key={j}>{renderInline(line.replace(/^- /, ""))}</li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{renderInline(b)}</p>;
      })}
    </div>
  );
}

function renderInline(text: string) {
  // Replace **bold** with <strong>
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}
