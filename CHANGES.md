# Changes

## Deployed to Railway (2026-10-25)

The app is now live at `https://revision-guide-production.up.railway.app`
(Phases 1-8). Three deploy gotchas hit along the way, now documented in
SETUP.md section 4: Railway assigns its own runtime port (ours came up as
8080) and the domain must target that exact port or you get a 502;
`NEXT_PUBLIC_*` variables are baked in at build time, so saving one isn't
enough — you need to trigger a real rebuild via the "Apply changes"
prompt, or you'll see an "Internal Server Error" from a stale build.

## Phase 8 — Combined Science, Higher tier (2026-10-25)

- Six real topics across all three sciences, researched against AQA's
  official 8464 spec: **Biology** (Cell biology, Infection and response),
  **Chemistry** (Atomic structure and the periodic table, Rate and extent
  of chemical change), **Physics** (Energy, Forces).
- Required practicals built directly into their relevant topic's guide
  (microscopy and osmosis in Cell biology; concentration vs rate in Rates
  of reaction; specific heat capacity in Energy; force/acceleration in
  Forces) — apparatus, method, variables and sources of error — rather
  than siloed into a separate section.
- Correction mid-build from research: AQA's Physics equation sheet gives
  every force/motion equation used here (s=vt, a=Δv/t, F=ma, W=mg, p=mv),
  and Chemistry's rate topic has five factors, not four (pressure for
  gases was missing from the first draft) — both fixed before writing the
  content.
- `content/science/<biology|chemistry|physics>/spec.json` lists the fuller
  Trilogy syllabus per strand; unwritten topics show as "Coming soon."
- `scripts/verify-science-answers.mjs` added alongside the Maths one —
  every numeric Science answer independently recalculated and checked.

## Phase 7 — Maths, Higher tier (2026-10-23)

- **KaTeX maths formatting**, wired into both guide text (Markdown `$...$`
  via remark-math/rehype-katex) and quiz/flashcard plain strings (a new
  `MathText` component) — fractions, powers, roots and equations render as
  real typeset maths rather than plain `$...$` text.
- **Six Higher-tier topics** with real content: Surds and indices,
  Quadratic equations, Simultaneous equations, Compound growth and decay,
  Trigonometry, and Probability trees — researched against AQA's official
  8300 spec and formula sheet (confirmed SOHCAHTOA, the sine/cosine rules
  and the quadratic formula are all given in the exam, not memorised).
  `content/maths/spec.json` lists the fuller Higher syllabus; unwritten
  topics show as "Coming soon."
- **"Mark myself correct"** added to short-answer questions app-wide (a
  brief requirement missed in Phase 3) — useful since some correct answers
  (surd forms, etc.) are hard to type exactly.
- **Numeric answers independently verified**: `scripts/verify-maths-answers.mjs`
  recalculates every numeric question's answer from scratch and checks it
  against the stored value — catches authoring slips (it actually caught
  and fixed one, a depreciation example in the compound growth guide).
  Documented in CONTENT.md as the process going forward, including for
  Science.

## Phase 6 — History (2026-10-23)

All five Edexcel (1HI0) topics, researched directly against Pearson's
official specification PDF (named content, real command words and mark
allocations per paper, not generic approximations):

- **Medicine in Britain, c1250–present** (Paper 1 thematic study) — all
  four periods (medieval, Renaissance, Industrial, modern) with their case
  studies (Black Death, Jenner, Snow and cholera, penicillin).
- **The British sector of the Western Front, 1914–18** (Paper 1 historic
  environment) — the treatment chain, named innovations, source-usefulness
  practice.
- **The American West, c1835–c1895** (Paper 2 period study) — all three
  key topics, settlement through to Wounded Knee and the Dawes Act.
- **Anglo-Saxon and Norman England, c1060–88** (Paper 2 British depth
  study) — succession crisis through to William I's death.
- **Weimar and Nazi Germany, 1918–39** (Paper 3 modern depth study) — all
  four key topics, plus a question practising the interpretations-comparison
  skill unique to this paper.

No engine changes needed — History reuses Phase 3's content system,
flashcards, quizzes (ordering questions suit chronology well) and
past-paper tracker as-is, which is exactly what that shared engine was
built for.

## Phase 5 — AI tutor (2026-10-23)

- AI tutor, off by default — only turns on once `ANTHROPIC_API_KEY` is set
  (SETUP.md section 7). Every AI button is hidden until then; verified the
  rest of the app works identically with it off.
- Three entry points, each giving the tutor the question, mark scheme and
  her answer for board/tier-specific help: **Get feedback** on a written
  extended-answer quiz question, **Explain this** on a quiz mistake, and
  **Help with this question** on a real-paper mistake (uses Claude's vision
  to read an attached photo of the question).
- Photo upload for real-paper mistakes, straight to her own folder in the
  `mistake-photos` Storage bucket — works independently of the AI tutor, so
  photos can be attached ahead of turning AI on.
- Guardrails baked into the system prompt: stays on her GCSE subjects only,
  teaches with hints before full answers, age-appropriate and concise,
  never states a mark/grade as certain.
- Cost controls: 30 AI messages/day per user by default
  (`AI_DAILY_MESSAGE_LIMIT`), max response length capped, cost-efficient
  model by default (`ANTHROPIC_MODEL`, defaults to `claude-haiku-5-5`) —
  all three configurable without a code change.

## Phase 4 — Mistakes bank and Report a mistake (2026-10-23)

- **Mistakes bank** (`/mistakes`): real data now, filterable by subject and
  topic. Each item shows her answer, the correct answer and the
  explanation. **Retry** re-asks the actual question; **Mark as understood**
  self-attests. Either way, it takes being right twice on separate days
  (tracked via a new `last_correct_date` column) before an item leaves the
  bank — two clicks in one sitting don't count twice.
- **Report a mistake**: a flag link on every revision guide, flashcard and
  quiz question, with the four reasons from the brief (wrong answer, typo,
  not on my spec, confusing) plus an optional comment.
- **Admin → Reports** (Me → Reports, admin only): lists open reports with
  enough context to find and fix the item (subject, topic, and the actual
  question/flashcard text) — never her answers or progress, per the brief.
- Fixed quiz question ids to be namespaced (`subject/strand/topic#id`)
  instead of short per-topic ids, so a mistake/report can always be traced
  back to its exact content file. New `mistakes.subject` column so mistakes
  can be filtered by subject (and real-paper mistakes, which don't belong
  to one topic, still show which subject they're from).
- Migrations: [0003](supabase/migrations/0003_mistakes_last_correct.sql),
  [0004](supabase/migrations/0004_mistakes_subject.sql).

### Known gaps (later phases)
- Photo upload on real-paper mistakes isn't wired up yet.
- "Explain this" (AI tutor) isn't shown anywhere — correctly hidden until
  Phase 5 adds an API key.

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
