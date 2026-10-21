# Changes

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
