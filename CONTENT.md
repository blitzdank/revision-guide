# Content structure

This explains how revision content (notes, flashcards, questions, past-paper
links) is organised, so you can ask Claude Code to add or fix content without
needing to know the codebase.

Content hasn't been written yet — it starts in Phase 3 (English). This file
describes the structure every subject will follow from then on.

## Where content lives

Built-in content lives in the `content/` folder, one subdirectory per
subject, e.g.:

```
content/
  english-literature/
    spec.json              # every topic/subtopic, tagged with its spec reference
    macbeth/
      guide.md              # the revision guide (notes) for this topic
      flashcards.json        # built-in flashcards for this topic
      questions.json          # built-in quiz questions for this topic
  history/
    ...
  past-papers.json          # links to official papers/mark schemes per subject/year
```

Her own data — progress, her own flashcards and notes, mistakes, countdowns —
lives in the Supabase database instead, never in these files (see the data
model in the build brief, section 8).

## Rules every piece of content follows

- **Tagged to the spec.** Every note section, flashcard and question
  references a spec code from that subject's `spec.json`, so coverage can be
  checked against the real exam board specification.
- **No copied exam questions.** Quiz questions are original, written in the
  style and mark allocation of the real papers — never copied from past
  papers or mark schemes. Past papers are linked to, never reproduced.
- **No copied set texts.** Macbeth and A Christmas Carol are public domain
  and can be quoted freely. An Inspector Calls and the Power and Conflict
  poems are still in copyright — refer to them by title/act/stanza, with only
  short quotations where needed.
- **Original writing.** Notes and explanations are written from scratch, not
  copied from revision sites or textbooks.
- **Maths/Science answers are checked**, not just written — by working them
  out, and with an automated check where practical.

## Asking for content changes

Once content exists, you can ask Claude Code things like:

- "Add three flashcards on the Treaty of Versailles to History Paper 1" —
  it'll add them to `content/history/.../flashcards.json`, tagged to the
  right spec reference.
- "Fix the mistake reported on [item]" — open the admin reports page (Me →
  Manage reports, added in Phase 4) to see what was flagged, then ask Claude
  Code to fix that specific item.
- "The quiz for [topic] needs more numeric questions" — it'll add them and
  double-check the worked answers.
