# Changes

## Phase 3 — English, and the shared learning engine (2026-10-23)

This phase builds the content/flashcard/quiz engine every later subject
reuses, plus real English content on top of it.

- **Content system**: subjects map to a `content/<subject>/<strand>/...`
  folder of `spec.json` (every topic tagged to a real AQA spec reference,
  including ones not written yet — see the "Coming soon" entries on the
  English subject page), `guide.md`, `flashcards.json`, `questions.json`.
  See [CONTENT.md](CONTENT.md).
- **Revision guides**: Markdown-rendered, with key terms highlighted and
  exam-tip boxes.
- **Flashcards**: Leitner spaced repetition (boxes 1-5, ~1/2/4/8/16-day
  intervals), flip/swipe study screen, "X left" counter. A card already
  reviewed today won't reappear until it's next due.
- **Quizzes**: all 5 question types from the brief — multiple choice, short
  answer, numeric, ordering, and self-marked extended answers (shows
  indicative content + mark-scheme-style level descriptors, she enters her
  own mark). Instant per-question feedback; wrong answers are written to the
  `mistakes` table automatically (the Mistakes bank screen itself is
  Phase 4).
- **Past papers & tracker**: links to AQA's official past-papers pages per
  subject, plus a marks-per-question tracker (`paper_attempts`); dropped
  marks also feed the mistakes table.
- **Real content**: English Language (4 of 10 AQA topics fully written:
  language analysis, structure analysis, descriptive/narrative writing,
  viewpoint writing) and English Literature (3 of 5: Macbeth, A Christmas
  Carol, Power and Conflict) — spec-mapped against AQA's official 8700/8702
  specifications. The rest are listed in spec.json as "Coming soon" and can
  be added later (ask Claude Code — see CONTENT.md).
- Back-navigation link added to every nested screen, so you're never forced
  back to a subject's start to get around.
- Removed the Home screen's "Due today" flashcard count per feedback — it
  would get overwhelming once every subject has content. The underlying
  spaced-repetition behaviour (a reviewed card won't repeat same-day) is
  unchanged.

### Known gaps (not yet built)
- Mixed quizzes across a whole paper/subject (brief section 6.3) — only
  per-topic quizzes exist so far.
- Confidence levels (Not started/Weak/Getting there/Confident) are still a
  static placeholder on subject tiles — real tracking is Phase 12 (Polish)
  per the brief's own phasing.
- Photo upload on real-paper mistakes — Phase 4, alongside the Mistakes
  bank screen itself.

## Phase 2 — Exam countdowns and Home screen (2026-10-23)

- Exam countdowns: add/edit/delete, with an optional time. Lists soonest
  first, with past exams moved to a "Done" section automatically.
- Home screen's "Next exam" card now shows the real nearest countdown
  (days away, or hours on the final day if a time was given) and links to
  the full countdowns list.
- New `countdowns.all_day` column
  ([migration 0002](supabase/migrations/0002_countdown_all_day.sql)).

### Deployed
- Code is pushed to GitHub (`main` branch). Railway deploy is pending —
  Railway was down when we tried; pick up from SETUP.md section 4 once it's
  back.

## Phase 1 — Foundations (2026-10-21)

- Project set up: Next.js (App Router) + TypeScript + Tailwind CSS, hosted on
  Railway, database/auth on Supabase.
- Design tokens for the baby pink / baby yellow palette, in both light and
  dark mode, with the dark-mode and button-text contrast checked against
  WCAG AA (the brief's suggested dark-mode tokens made some text invisible
  on its own background — adjusted, see the comment in `globals.css`).
- Light / Dark / Auto theme toggle, follows the device by default.
- Layout and navigation: bottom tab bar (Home · Subjects · Mistakes · Me) on
  phone, sidebar on iPad landscape and MacBook.
- Sign in, invite-only sign up, forgot/reset password, all backed by
  Supabase auth. An invite code is required and checked at the database
  level (not just in the app) before an account can be created.
- `student` / `admin` roles. Admins get an invite-codes management page.
- Installable PWA: manifest, home-screen icon, and a minimal service worker
  so "Add to Home Screen" opens full-screen on iPhone/iPad/Mac.
- Placeholder Home and Subjects screens with all seven subject tiles
  (English, History, Maths, Combined Science, RE, Food, Graphics).
- `SETUP.md`, `CONTENT.md` written; this file started.

### To test
See the checklist sent alongside this phase.

### Known gaps (later phases)
- No real content yet (guides/flashcards/quizzes) — Phase 3 onward.
- Exam countdowns and the real Home screen widgets — Phase 2.
- Mistakes bank and "Report a mistake" are placeholders — Phase 4.
- AI tutor — Phase 5, off until an API key is added.
