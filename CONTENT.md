# Content structure

This explains how revision content (notes, flashcards, questions, past-paper
links) is organised, so you can ask Claude Code to add or fix content without
needing to know the codebase.

## Where content lives

Built-in content lives in the `content/` folder: one subdirectory per
subject, with a strand subfolder when a subject has them (English has
language/literature; Combined Science will have biology/chemistry/physics).
Each topic folder has a guide, flashcards and questions:

```
content/
  english/
    language/
      spec.json                        # every topic in this strand, tagged with its AQA spec reference
      language-analysis-fiction/
        guide.md                        # the revision guide (notes) for this topic
        flashcards.json                  # built-in flashcards for this topic
        questions.json                    # built-in quiz questions for this topic
      ...
    literature/
      spec.json
      macbeth/...
  history/
    spec.json                          # no strands — topics sit directly under history/
    medicine-in-britain/...
  maths/
    spec.json                          # strands used as grouping ("papers") even though
    quadratic-equations/...            # Maths papers aren't topic-restricted
  past-papers.json                     # links to official papers/mark schemes, per subject
```

A topic only needs a `guide.md`/`flashcards.json`/`questions.json` folder
once it's been written — `spec.json` lists every topic in the real
specification regardless, so the Subjects screen can show what's covered
and what's "Coming soon."

Her own data — progress, her own flashcards and notes, mistakes, countdowns —
lives in the Supabase database instead, never in these files (see the data
model in the build brief, section 8).

## Writing conventions (guide.md)

- `**bold**` marks a key term — rendered with a highlight.
- Every blockquote (`> ...`) is rendered as an "exam tip" box — don't use
  blockquotes for anything else in a guide.
- Tables render as a styled table (used for reference lists, e.g. Power and
  Conflict's poem list).
- For Maths/Science, wrap LaTeX in `$...$` (inline) or `$$...$$` (its own
  line) — rendered with KaTeX. This works in `guide.md`, and also in
  flashcard fronts/backs and quiz question prompts/options/explanations
  (those are plain strings, not Markdown, but `$...$` math still renders).

## Rules every piece of content follows

- **Tagged to the spec.** Every note section, flashcard and question
  references a spec code from that subject's `spec.json`, so coverage can be
  checked against the real exam board specification.
- **No copied exam questions.** Quiz questions are original, written in the
  style and mark allocation of the real papers — never copied from past
  papers or mark schemes. Past papers are linked to, never reproduced.
- **No copied set texts.** Public-domain texts (e.g. Macbeth, A Christmas
  Carol) can be quoted freely. Anything still in copyright (modern novels,
  plays, poems) is referred to by title/act/stanza, with only short
  quotations where needed.
- **Original writing.** Notes and explanations are written from scratch, not
  copied from revision sites or textbooks.
- **Maths/Science answers are checked**, not just written — by working them
  out by hand, and with an automated script. `scripts/verify-maths-answers.mjs`
  and `scripts/verify-science-answers.mjs` each independently recalculate
  every numeric-answer question in `content/maths` / `content/science` and
  check it against the stored answer. Run the relevant one after adding or
  changing any numeric Maths or Science question:
  ```bash
  node scripts/verify-maths-answers.mjs
  node scripts/verify-science-answers.mjs
  ```
  Add an entry to the script's `checks` object for each new numeric
  question (see the existing entries for the pattern) — this has already
  caught and fixed one authoring error (a depreciation example in Phase 7).

## Asking for content changes

You can ask Claude Code things like:

- "Add three flashcards on the Treaty of Versailles to History Paper 1" —
  it'll add them to `content/history/weimar-nazi-germany/flashcards.json`,
  tagged to the right spec reference.
- "Fix the mistake reported on [item]" — open the admin reports page (Me →
  Reports) to see what was flagged, then ask Claude Code to fix that
  specific item.
- "The quiz for [topic] needs more numeric questions" — it'll add them,
  double-check the worked answers, and (for Maths) run the verification
  script.
- "Write the content for [topic marked Coming soon]" — it'll research the
  real spec for that topic/board, then write the guide, flashcards and
  questions the same way as the topics already built.
