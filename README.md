# Revision Guide

A GCSE revision app: guides, flashcards, quizzes, past-paper tracking and a
mistakes bank, matched to specific exam boards and tiers. See
[`revision-guide-build-brief.md`](revision-guide-build-brief.md) for the full
brief this is built from.

- **New here?** Start with [`SETUP.md`](SETUP.md) — a step-by-step guide to
  getting your own copy running, no coding experience needed.
- **Adding or fixing content?** See [`CONTENT.md`](CONTENT.md).
- **What's been built so far?** See [`CHANGES.md`](CHANGES.md).

## Local development

```bash
npm install
npm run dev
```

Needs a `.env.local` file — see [`SETUP.md`](SETUP.md) section 3.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS · Supabase (Postgres, auth,
storage) · Railway (hosting) · KaTeX (Maths/Science formatting, from Phase 7)
· Anthropic Claude API (optional AI tutor, Phase 5).
