import katex from "katex";

/**
 * Renders a string that may contain inline LaTeX wrapped in $...$ (e.g.
 * "Solve $x^2 - 5x + 6 = 0$") — used for quiz question prompts, options and
 * flashcards, which are plain strings rather than Markdown. Guide text uses
 * MarkdownGuide instead (remark-math/rehype-katex), since it's full
 * Markdown already.
 */
export function MathText({ text }: { text: string }) {
  const parts = text.split(/(\$[^$]+\$)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
          const html = katex.renderToString(part.slice(1, -1), {
            throwOnError: false,
            displayMode: false,
          });
          // katex.renderToString escapes its own output; this is the
          // standard, safe way to render it (no user input reaches it —
          // only our own authored content files).
          return <span key={i} dangerouslySetInnerHTML={{ __html: html }} />;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
