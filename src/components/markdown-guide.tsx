import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

/**
 * Renders a topic's guide.md. By convention (see CONTENT.md): **bold** marks
 * a key term, every blockquote is an "exam tip" box (guide.md files don't
 * use blockquotes for anything else), and $...$ / $$...$$ is LaTeX maths
 * (Maths/Science guides), rendered with KaTeX.
 */
export function MarkdownGuide({ markdown }: { markdown: string }) {
  return (
    <div className="prose-guide flex flex-col gap-4 text-text">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h2: ({ children }) => (
            <h2 className="mt-2 text-lg font-bold text-text first:mt-0">{children}</h2>
          ),
          h3: ({ children }) => <h3 className="font-semibold text-text">{children}</h3>,
          p: ({ children }) => <p className="leading-relaxed text-text">{children}</p>,
          strong: ({ children }) => (
            <strong className="rounded bg-yellow/40 px-1 font-semibold text-text">
              {children}
            </strong>
          ),
          em: ({ children }) => <em className="text-text">{children}</em>,
          ul: ({ children }) => <ul className="list-disc space-y-1 pl-5">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal space-y-1 pl-5">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed text-text">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="rounded-xl border-l-4 border-pink bg-pink/15 px-4 py-3 text-sm text-text [&_p]:m-0">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto rounded-xl border border-black/10">
              <table className="w-full text-left text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-bg">{children}</thead>,
          th: ({ children }) => <th className="px-3 py-2 font-semibold text-text">{children}</th>,
          td: ({ children }) => <td className="border-t border-black/5 px-3 py-2 align-top text-text">{children}</td>,
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
