# Revision Guide — Build Brief for Claude Code

## 0. How to use this brief

You are building **Revision Guide**, a web app to help a Year 11 student in England revise for her GCSEs (exams in summer 2027). The owner (Connor) has **no coding experience** and will make future changes through Claude Code, so:

- Keep the codebase simple, well-commented and conventional. Prefer boring, popular tools over clever ones.
- Explain every setup step he has to do himself (accounts, keys, deploys) in plain English, one step at a time, in a `SETUP.md`.
- Build in the phases in section 12. Finish and deploy each phase before starting the next, and stop after each phase for him to test.
- When anything in this brief is unclear or conflicts with what you find in the official specifications, ask rather than guess.

---

## 1. Goal and users

- **Primary user:** one 15-year-old student (Year 11). Later, possibly a handful of her friends, each with their own account. Never sold or licensed.
- **Devices:** iPhone, iPad and MacBook. Must work equally well on all three, in Safari and Chrome.
- **Purpose:** everything she needs to revise in one place, matched exactly to her exam boards and options:
  - revision guides (notes) per topic
  - flashcards with spaced repetition
  - quizzes of exam-style questions
  - links to the official past papers and mark schemes, with a tracker for her marks
  - a mistakes bank where anything she gets wrong is saved to revisit, with explanations and optional AI help
  - exam countdowns she sets herself
- **Not included:** parent/teacher view, streaks, points, badges, revision planner. Keep it focused.

---

## 2. Subjects, boards and content scope

Build content in this order: **English → History → Maths → Science → RE → Food → Graphics.**

Before writing any content for a subject, read the board's current official specification and map every topic and subtopic to it. Tag every note, flashcard and question with its spec reference so coverage can be checked. Verify spec codes against the board's website; the codes below are a starting point.

| # | Subject | Board | Qualification / options |
|---|---|---|---|
| 1 | English Language | AQA | GCSE English Language (8700). No set texts. Focus on reading-question skills (Papers 1 & 2) and writing (descriptive/narrative, viewpoint). |
| 1 | English Literature | AQA | GCSE English Literature (8702). Set texts: **Macbeth** (Shakespeare), **A Christmas Carol** (19th-century novel), **An Inspector Calls** (modern text), **Power and Conflict** poetry cluster, plus unseen poetry skills. |
| 2 | History | Edexcel (Pearson) | GCSE History (1HI0). Paper 1: **Medicine in Britain c1250–present** with historic environment **The British sector of the Western Front 1914–18**. Paper 2: period study **The American West c1835–c1895** and British depth study **Anglo-Saxon and Norman England c1060–88**. Paper 3: modern depth study **Weimar and Nazi Germany 1918–39**. |
| 3 | Maths | AQA | GCSE Mathematics (8300), **Higher tier**. |
| 4 | Combined Science | AQA | GCSE Combined Science: **Trilogy** (8464), **Higher tier**. Split into Biology, Chemistry and Physics sections, plus required practicals. Do not include separate-science-only (triple) content. |
| 5 | Religious Studies | AQA | GCSE Religious Studies **A** (8062). Component 1 religions: **Christianity** and **Buddhism**. Component 2 themes: **B Religion and life**, **D Religion, peace and conflict**, **E Religion, crime and punishment**, **F Human rights and social justice**. |
| 6 | Food | Eduqas | GCSE Food Preparation and Nutrition. Cover the written exam content; mention the non-exam assessments only as context. |
| 7 | Graphics | Eduqas | GCSE Design and Technology, with in-depth focus on **papers and boards**. Cover core D&T content plus the papers-and-boards in-depth material for the written exam. |

### Copyright rules for content
- **Do not reproduce exam-board past paper questions or mark schemes.** Link to them on the official sites instead (section 6.5). All quiz questions must be original, written in the style, command words, mark allocations and format of the real papers.
- **Set texts:** Macbeth and A Christmas Carol are public domain and may be quoted freely. An Inspector Calls and many Power and Conflict poems are still in copyright: do not include full texts or long extracts. Refer to them by title, act or stanza, and keep any quotations short and only where needed for analysis.
- Notes and explanations must be original writing, not copied from revision websites or textbooks.

### Content accuracy
- Content is AI-written, so every item carries a **"Report a mistake"** button (section 6.7).
- Maths and Science answers must be checked by working them out, not just written. Where possible, write a small automated check (script) for numeric answers.

---

## 3. Design and interface

### Audience and tone
- 15-year-olds. **Modern, clean, calm.** Not childish: no cartoon mascots, no excessive emojis. Think a polished study app rather than a kids' game.
- Friendly, plain-English copy. Short labels. Encouraging but not cheesy ("Nice — 8/10" not "AMAZING SUPERSTAR!!!").
- Every core action should be reachable in **two taps or fewer** from the home screen.

### Colours
Main colours are **baby pink** and **baby yellow**. Use them as backgrounds, surfaces and highlights. Never use pale pink or pale yellow for body text, because it fails contrast. Define all colours as design tokens (CSS variables) so they can be tweaked in one place.

Suggested starting tokens (adjust for accessibility; all text must meet WCAG AA contrast):

| Token | Light mode | Dark mode | Use |
|---|---|---|---|
| `--bg` | `#FFF9FB` (near-white pink) | `#1C1720` (deep plum-charcoal) | Page background |
| `--surface` | `#FFFFFF` | `#262030` | Cards |
| `--pink` | `#F8C8DC` | `#F4B6CF` | Primary accent, selected states, buttons |
| `--pink-strong` | `#D9608F` | `#F4B6CF` | Text/icons on pink, links |
| `--yellow` | `#FFF1B8` | `#F7E08A` | Secondary accent, highlights, "due" badges |
| `--yellow-strong` | `#9A7400` | `#F7E08A` | Text on yellow |
| `--text` | `#2A2230` | `#F5EEF3` | Body text |
| `--muted` | `#7A6F80` | `#A99FB0` | Secondary text |
| `--correct` | `#2E9E6B` | `#5BD19A` | Right answers |
| `--wrong` | `#D64545` | `#FF7A7A` | Wrong answers |

- Give each subject its own small icon and a subtle tint within the pink/yellow palette, so they're easy to tell apart without breaking the theme.

### Dark mode
- A proper, designed dark mode (not just inverted colours): soft and low-glare for late-night revision.
- Follows the device setting by default, with a manual Light / Dark / Auto toggle in settings.

### Typography and layout
- One rounded, highly readable sans-serif font, e.g. **Plus Jakarta Sans** or **Nunito** (Google Fonts). Minimum 16px body text.
- **Mobile-first.** Bottom tab bar on phone; sidebar on iPad landscape and MacBook.
- Large tap targets (at least 44px). Generous spacing. Rounded cards.
- Gentle, quick animations (card flips, progress fills). Respect "reduce motion" settings.

### Navigation (phone)
Bottom tabs: **Home · Subjects · Mistakes · Me**

---

## 4. Screens

1. **Sign in.** Email and password, with "forgot password". Remember the session on each device.
2. **Home**
   - Nearest exam countdown at the top (tap to see all countdowns).
   - "Due today": number of flashcards due for review, one tap to start.
   - "Pick up where you left off": the last topic she was in.
   - Mistakes bank count, one tap to retry.
   - Subject tiles with a simple progress ring each.
3. **Subjects list.** Seven tiles in the order above, each showing board and tier.
4. **Subject page**
   - Topics grouped by exam paper (e.g. History Paper 1, 2, 3), matching the spec.
   - Each topic shows confidence level (from flashcards and quizzes).
   - Buttons: Guide · Flashcards · Quiz · Past papers.
   - "Mixed quiz" across the whole subject or a whole paper.
5. **Revision guide (topic notes).** Short sections, key terms highlighted, "exam tips" boxes, worked examples (Maths/Science), key quotations and themes (English). Ends with buttons to flashcards and quiz for that topic.
6. **Flashcards.** Tap to flip, then "Got it" / "Not yet" (swipe right/left on touch). Shows how many are left. Her own cards are mixed in with built-in ones.
7. **Quiz.** One question at a time, marks shown (e.g. "[4 marks]"). Instant feedback with the model answer and mark-scheme points. Results screen at the end, with wrong answers sent to the mistakes bank automatically.
8. **Mistakes bank.** Filter by subject and topic. Each item shows her answer, the correct answer and the explanation. Actions: Retry · Explain this (AI tutor, if enabled) · Mark as understood. Items leave the bank after she gets them right twice on separate days.
9. **Past papers.** Per subject: list of papers by year with links to the official paper, mark scheme and examiner report on the board's website. A tracker to log her mark per question (section 6.5).
10. **Exam countdowns.** List of countdowns she has created; add/edit/delete.
11. **Me / Settings.** Theme toggle, her own flashcards and notes, account, sign out.

---

## 5. Question types

All original, exam-style, tagged with spec reference, topic and marks.

| Type | Used for | Marking |
|---|---|---|
| Multiple choice | All subjects, especially Science, Food, Graphics | Automatic |
| Short answer / key term | Definitions, dates, keywords | Automatic, with accepted alternative spellings; option to "mark myself correct" |
| Numeric | Maths, Science calculations | Automatic with tolerance and units; show full worked solution |
| Ordering / matching | Timelines (History), processes (Science, Food) | Automatic |
| Extended answer (4–16+ marks) | English, History, RE essays, longer Science/Maths | **Self-marked**: she writes her answer, then sees indicative content and mark-scheme style level descriptors and gives herself a mark. If the AI tutor is on, offer "Get feedback" for an estimated mark and tips, clearly labelled as an estimate. |

Maths and Science need proper formatting for fractions, powers, roots and equations (use **KaTeX**).

---

## 6. Features in detail

### 6.1 Flashcards and spaced repetition
- Built-in decks per topic, plus her own cards.
- Use a simple Leitner-style system (boxes 1–5, review intervals roughly 1, 2, 4, 8, 16 days). "Not yet" returns the card to box 1.
- "Due today" on Home pulls due cards across all subjects; she can also study a single topic any time.

### 6.2 Revision guides
- Stored as Markdown content files (section 8), rendered nicely.
- She can add her own notes to any topic (shown under the built-in notes, editable only by her).

### 6.3 Quizzes
- Topic quiz (default 10 questions), paper-level mixed quiz, whole-subject mixed quiz.
- Weight questions towards topics with lower confidence.

### 6.4 Mistakes bank
- Every wrong quiz answer and every real-paper question she drops marks on (6.5) lands here automatically.
- Shows source (e.g. "Quiz: Medicine – Renaissance" or "Real paper: 2023 Paper 1, Q5").
- For real-paper items she can attach a **photo of the question** and her answer, to use with the AI tutor.

### 6.5 Real past papers
- For each subject and paper: links to the official past papers, mark schemes and examiner reports on the board's own website. Do not download or re-host the PDFs. Store the links in a content file so they're easy to update, and check every link works.
- **Tracker:** she picks a paper (subject, year, paper number), enters marks per question (e.g. Q3: 2/4), and sees her total and percentage. Questions where she dropped marks go into the mistakes bank, with the paper reference and optional photo.

### 6.6 Exam countdowns
- She creates as many as she likes: name (e.g. "English Lit Paper 1", "Maths mocks"), date and optional time.
- Several can be shown at once. Home shows the nearest one; the countdowns screen lists all, soonest first, in days (and hours on the final day).
- Past countdowns move to a "done" section automatically.

### 6.7 Report a mistake
- On every note section, flashcard and question. She picks a reason (wrong answer, typo, not on my spec, confusing) and can add a comment.
- Reports are stored in a table. Provide a simple **admin-only** page (for Connor's account) listing open reports with the item they refer to, so they can be fixed with Claude Code later. The admin page shows reports only, never her progress or answers.

### 6.8 AI tutor (optional, switchable)
- **Off by default.** Turned on only when an `ANTHROPIC_API_KEY` is added to the hosting environment. When off, hide all AI buttons and the app works fully with pre-written explanations.
- Uses the Claude API through a **server-side route only**. The key must never reach the browser.
- Entry points: "Explain this" on a mistake, "Get feedback" on an extended answer, "Help with this question" on a real-paper photo.
- Each conversation is given the question, mark scheme points, her answer and her spec context, so help is specific to her board and tier.
- **Guardrails** (system prompt):
  - She is a 15-year-old GCSE student. Stay on revision and school-study topics only; politely steer anything else back to revision.
  - Teach rather than just give answers: hints first, then a full explanation if she asks.
  - Age-appropriate, kind, concise. Never claim certainty about grades; label any mark as an estimate.
- **Cost controls:** daily message limit per user (e.g. 30, set in config), max response length, and use a cost-efficient model by default with the model name in an environment variable so it can be changed without code edits. Note in `SETUP.md` that a monthly spend limit should be set in the Claude Console.

---

## 7. Accounts and access
- Sign-in required. Each user's progress, cards, notes, mistakes and countdowns are private to them (enforced at the database level with row-level security).
- **Invite-only:** public sign-up is disabled. Connor's admin account can create invite codes for new users (her friends, later).
- Two roles: `student` and `admin`. Admin sees the reports page and invite codes only.

---

## 8. Tech stack (suggested)

Keep it simple, free-tier friendly and popular, so Claude Code can maintain it easily.

- **Framework:** Next.js (App Router) with TypeScript.
- **Styling:** Tailwind CSS using the design tokens in section 3.
- **Database and auth:** Supabase (Postgres, email auth, row-level security, storage for question photos).
- **Hosting:** Vercel (free tier), auto-deploying from a GitHub repository.
- **Maths formatting:** KaTeX.
- **Installable app:** make it a PWA, so she can "Add to Home Screen" on iPhone/iPad and it opens full-screen like an app, with its own icon.
- **AI:** Anthropic SDK, server route only (section 6.8).

### Content storage
- Built-in content (notes, flashcards, questions, past-paper links) lives in the code repository as Markdown/JSON files, one folder per subject, e.g.:
  ```
  content/
    english-literature/
      spec.json            # topics and spec references
      macbeth/
        guide.md
        flashcards.json
        questions.json
    history/...
    past-papers.json       # links per subject/paper/year
  ```
- User data (progress, her own cards and notes, mistakes, countdowns, reports) lives in Supabase.

### Data model (user data)

| Table | Key fields |
|---|---|
| `profiles` | id, display_name, role (student/admin), theme |
| `card_progress` | user_id, card_id, box (1–5), next_due, last_seen |
| `user_cards` | id, user_id, subject, topic, front, back |
| `user_notes` | id, user_id, subject, topic, body |
| `quiz_attempts` | id, user_id, subject, topic/paper, score, total, taken_at |
| `question_attempts` | id, user_id, question_id, answer, marks_awarded, correct, attempted_at |
| `mistakes` | id, user_id, source (quiz/real_paper), question_id or paper_ref, her_answer, photo_path, times_right, status, created_at |
| `paper_attempts` | id, user_id, subject, year, paper, question_marks (json), total, max_total |
| `countdowns` | id, user_id, name, exam_at |
| `reports` | id, user_id, item_type, item_id, reason, comment, status |
| `invites` | code, created_by, used_by, used_at |
| `ai_usage` | user_id, date, message_count |

---

## 9. Progress and confidence
- Per topic: combine flashcard boxes and recent quiz scores into a simple confidence level: **Not started · Weak · Getting there · Confident**.
- Show as a colour dot on topics and a progress ring per subject. No percentages to obsess over, no comparisons with others.

---

## 10. Accessibility and quality
- WCAG AA contrast in both themes. Test pink/yellow combinations specifically.
- Works with iOS text-size settings and screen readers (proper labels on buttons and cards).
- Fast on a phone: content loads per topic, not all at once.
- Graceful offline behaviour: if the connection drops mid-quiz, keep her answers and sync when back online.

---

## 11. Deliverables beyond the app
- `SETUP.md`: plain-English, step-by-step guide for Connor to create the GitHub, Supabase, Vercel and (optional) Claude Console accounts, add environment variables, deploy, create his admin account and her account, and install the app on her home screen.
- `CONTENT.md`: how content files are structured, so new questions or fixes can be added by asking Claude Code.
- `CHANGES.md`: short log of what was built in each phase.

---

## 12. Build phases

Stop after each phase, deploy, and give Connor a short checklist of what to test.

1. **Foundations.** Project setup, design tokens, light/dark themes, layout and navigation, sign-in, invite codes, admin role, PWA install, deploy to Vercel. Placeholder subject tiles for all seven subjects.
2. **Exam countdowns and Home screen.**
3. **English (Language and Literature).** Spec mapping, revision guides, flashcards with spaced repetition, quizzes including self-marked extended answers, past-paper links and tracker. This phase builds all the shared learning features; later subjects reuse them.
4. **Mistakes bank and Report a mistake**, including the admin reports page.
5. **AI tutor** (behind the on/off switch), with guardrails, usage limits and photo upload.
6. **History** (all five Edexcel topics).
7. **Maths Higher** (with KaTeX and numeric answer checking).
8. **Combined Science Trilogy Higher** (Biology, Chemistry, Physics, required practicals).
9. **RE** (Christianity, Buddhism, themes B, D, E, F).
10. **Food** (Eduqas).
11. **Graphics** (Eduqas D&T, papers and boards).
12. **Polish.** Progress and confidence views, performance, accessibility checks, content review using any reports.

---

## 13. Definition of done (each phase)
- Works on iPhone Safari, iPad Safari and MacBook Chrome/Safari, in both light and dark mode.
- No content outside her specification and options.
- No reproduced exam-board questions, and no in-copyright set texts beyond short quotations.
- All numeric answers checked.
- Deployed, with `CHANGES.md` updated and a test checklist for Connor.
