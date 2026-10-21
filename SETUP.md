# Setup guide (Phase 1)

This is written for someone with no coding experience. Follow it in order,
the first time you set the project up. Each step says exactly what to click.

You'll be creating three free accounts: **GitHub** (stores the code),
**Supabase** (the database and sign-in system) and **Railway** (hosts the
live app, since you already have an account there).

---

## 1. Put the code on GitHub

GitHub is where the project's code lives, and it's how Railway will know
what to deploy.

1. Go to [github.com](https://github.com) and sign in (or create a free
   account).
2. Click the **+** in the top right → **New repository**.
3. Name it `revision-guide`, leave it **Private**, don't tick any of the
   "initialize with" boxes. Click **Create repository**.
4. GitHub shows you a page with some commands. Ignore those — instead, come
   back here and tell Claude Code "push this to GitHub at
   `https://github.com/<your-username>/revision-guide`" and it will handle
   the rest (it will ask before pushing anything).

---

## 2. Create the Supabase project (database + sign-in)

1. Go to [supabase.com](https://supabase.com) → **Start your project** →
   sign in with GitHub.
2. Click **New project**. Pick any organisation, name it `revision-guide`,
   generate (and save somewhere safe) a database password, pick a region
   close to you (e.g. London), and click **Create new project**. Wait ~2
   minutes for it to finish setting up.
3. In the left sidebar, open **Project Settings → Data API**. You'll need
   two values from this page in step 4 below:
   - **Project URL**
   - **anon public** key (under "Project API keys")
4. In the left sidebar, open **SQL Editor** → **New query**. Open the file
   [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql)
   in this project, copy **all** of its contents, paste into the SQL editor,
   and click **Run**. This creates all the tables and security rules. You
   should see "Success. No rows returned".
5. Create your own admin invite code so you can sign up as the admin. Still
   in the SQL Editor, run this (pick your own code instead of the example —
   letters and numbers only, no spaces):
   ```sql
   insert into invites (code, grants_role) values ('CONNOR2026', 'admin');
   ```
6. Open **Authentication → Sign In / Providers → Email** and turn **off**
   "Confirm email". This is a private, invite-only app for your family, so
   there's no need to verify email addresses — it just adds friction.
7. Open **Authentication → URL Configuration**. Set:
   - **Site URL**: leave as `http://localhost:3000` for now — you'll change
     this once the app is deployed (step 4 below).
   - **Redirect URLs**: add `http://localhost:3000/auth/callback`.

---

## 3. Add the Supabase keys to the app

1. In this project's folder, find the file `.env.example` and make a copy of
   it named `.env.local` in the same folder (ask Claude Code to do this if
   you're not sure how).
2. Open `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL` — the Project URL from step 2.3.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — the anon public key from step 2.3.
   - Leave `NEXT_PUBLIC_SITE_URL` as `http://localhost:3000`.

This file is never uploaded to GitHub (it's in `.gitignore`), so your keys
stay private.

---

## 4. Deploy to Railway

1. Go to [railway.app](https://railway.app) and sign in.
2. Click **New Project → Deploy from GitHub repo**, and choose the
   `revision-guide` repository (you may need to click "Configure GitHub App"
   and grant Railway access to it first).
3. Railway will detect it's a Next.js app and start a build automatically —
   let it finish (it'll likely fail the first time because the environment
   variables aren't set yet; that's expected).
4. Click into the new service → **Variables** tab → add the same three
   variables from your `.env.local` (step 3), except set
   `NEXT_PUBLIC_SITE_URL` to your Railway URL once you have it (next step).
5. Go to **Settings → Networking → Generate Domain**. Railway gives you a
   public URL like `https://revision-guide-production.up.railway.app`.
6. Update the `NEXT_PUBLIC_SITE_URL` variable to that URL, and redeploy
   (Railway usually does this automatically when you change a variable —
   if not, click **Deploy** in the top right).
7. Back in Supabase, go to **Authentication → URL Configuration** and:
   - Add your Railway URL to **Redirect URLs** as
     `https://<your-railway-url>/auth/callback`.
   - You can leave **Site URL** as `http://localhost:3000` — the app always
     sends the exact redirect URL it needs, so this field mostly matters for
     Supabase's own default email templates.

---

## 5. Create your admin account

1. Open your Railway URL (or `http://localhost:3000` if testing locally) and
   go to **Have an invite code?**.
2. Enter the invite code you created in step 2.5 (e.g. `CONNOR2026`), your
   name, your email and a password.
3. You're now signed in as an admin. Go to **Me → Manage invite codes** to
   create invite codes for your daughter and, later, her friends — each
   person uses their own code once to create their account.

---

## 6. Install it like an app on her devices

On her iPhone/iPad (Safari) or Mac (Safari or Chrome):

1. Open the Railway URL.
2. **iPhone/iPad (Safari):** tap the Share icon → **Add to Home Screen**.
3. **Mac (Safari):** File menu → **Add to Dock**. **Mac (Chrome):** click the
   install icon in the address bar, or Menu → **Cast, Save, and Share** →
   **Install page as app**.

It'll open full-screen with its own icon, like a normal app.

---

## Running it locally while you work with Claude Code

Once `.env.local` is filled in (step 3), you or Claude Code can run:

```bash
npm install
npm run dev
```

and open `http://localhost:3000`.

---

## Later phases

- **Phase 5 (AI tutor)**: adds an `ANTHROPIC_API_KEY` variable. SETUP.md will
  get a new section then, including setting a monthly spend limit in the
  Claude Console.
