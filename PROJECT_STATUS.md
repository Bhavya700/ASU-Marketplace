### ASU Marketplace — Migration Summary, Setup, and Next Steps

This document captures what has been implemented so far for ASU Marketplace, the current project state, and the detailed plan to reach the final goal.

#### Repository and Branch
- Repository: [ASU-Marketplace on GitHub](https://github.com/Bhavya700/ASU-Marketplace)
- Active branch with the latest work: `asu-astro-supabase`
- PR creation link: https://github.com/Bhavya700/ASU-Marketplace/pull/new/asu-astro-supabase

---

### 1) What’s Implemented

#### A. Framework, Runtime, Tooling
- Migrated to Astro 4 with React integration and TypeScript.
- Configured server output with `@astrojs/node` adapter (`output: "server"`) to support backend API routes in Astro.
- Tailwind CSS added and configured with custom ASU colors (maroon, gold, dark).
- Removed Node.js/Express app usage in favor of native Astro server routes.

Key files:
- `astro.config.mjs` — Astro configuration, server output with Node adapter on port 4321.
- `tailwind.config.mjs` — Tailwind setup with ASU color palette.
- `tsconfig.json` — TS configuration.

#### B. Supabase Integration (replacing Firebase)
- Added Supabase client and environment variable wiring.
- `src/lib/supabase.ts` contains Supabase client initialization and app types. Removed any `trade_for` type field per requirements.
- Firebase-related logic removed from the new app; no Firebase SDK usage remains.

Environment variables (see Setup section for details):
- `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`

#### C. Authentication and Session Wiring
- Placeholder Supabase OAuth callback route set up: `src/pages/api/auth/callback.ts`.
- `src/contexts/AuthContext.tsx` wired to the new app context and defaults (updated default avatar path and branding). Final tie-in to Supabase auth flows is part of the next tasks (see Plan).

#### D. Email/Support Backend API
- Implemented `src/pages/api/report-issue.ts` using Nodemailer for sending support/report emails.
- Automatic discovery of Google OAuth client credentials from any `client_secret_*.json` at project root.
- Supports two email auth modes:
  1) OAuth2 (preferred): `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, `GOOGLE_REFRESH_TOKEN`
  2) Basic Gmail SMTP fallback: `GMAIL_USER`, `GMAIL_PASS`

#### E. Routing, Pages, and App Shell
- Main Astro entry: `src/pages/index.astro` mounts React `App` with `client:load`.
- `src/components/App.tsx` (React Router) manages client routes.
- All visible branding updated from “GT Marketplace” to “ASU Marketplace”.
- Navigation updated (`src/components/PersistentNav.tsx` + `PersistentNav.css`) to ASU logo/colors.
- Explore Page tags limited to exactly: Textbooks, Electronics, Clothing, Furniture, Tickets, Appliances, Other.
- “Trade” option and any residual trade logic removed from UI and types. Kept only the Message button which navigates to `/conversations`.
- New route `/conversations` added; basic page placeholder implemented.

Affected key files (non-exhaustive):
- `src/components/App.tsx`
- `src/components/PersistentNav.tsx`, `src/components/PersistentNav.css`
- `src/pages/LandingPage.tsx`, `src/pages/LandingPage.css`
- `src/pages/ExplorePage.tsx`, `src/pages/ExplorePage.css`
- `src/pages/ConversationsPage.tsx`, `src/pages/ConversationsPage.css`
- `src/pages/MyListingsPage.tsx`, `src/pages/NewListingPage.tsx`
- `src/pages/MessagesPage.tsx`, `src/pages/PurchaseHistoryPage.tsx`
- `src/pages/AboutPage.tsx`, `src/pages/SupportPage.tsx`
- `src/pages/ResetPassword.tsx`, `src/pages/ResetPasswordConfirm.tsx`

#### F. Branding and Assets
- All visible references of "GT" replaced with "ASU" branding.
- Color scheme migrated to ASU maroon and gold.
- Default images updated; `public/ui/` contains the design reference images provided for all pages.

#### G. Feature Removals
- AI Price Suggestion feature removed.
- Campus Map page removed.
- "Trade" option and types removed.

#### H. Developer Experience
- `src/env.d.ts` includes types for all required environment variables.
- `ENV.example` pattern documented below in this file (use real `.env` in the root).
- Warnings: Astro expects `.astro` route files in `src/pages/`. We intentionally mount a React SPA via `index.astro` → `App.tsx`. This is valid; Astro build may warn about `.tsx` and `.css` in `src/pages/`. We can silence by migrating those to components + `.astro` routes later (see Plan).

---

### 2) Setup and Running Locally

#### A. Prerequisites
- Node.js v18+
- npm

#### B. Environment Variables (.env at project root)
Create `.env` in the project root. Minimal required:

```
PUBLIC_SUPABASE_URL=your_supabase_project_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Email via OAuth2 (preferred)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=your_google_redirect_uri
GOOGLE_REFRESH_TOKEN=your_google_refresh_token

# OR basic Gmail SMTP fallback
GMAIL_USER=your_gmail_address
GMAIL_PASS=your_gmail_app_password
```

Place your downloaded Google OAuth JSON (e.g., `client_secret_xxx.apps.googleusercontent.com.json`) at the project root. The email API will auto-detect it if OAuth env vars are not set.

#### C. Scripts
- Install: `npm install`
- Dev: `npm run dev` → opens on http://localhost:4321
- Build: `npm run build`
- Preview build: `npm run preview`

---

### 3) Supabase Schema Expectations (Draft)

Note: Final schema may be adjusted during implementation.

Listings (`listings`)
- `id` uuid (pk, default gen_random_uuid())
- `title` text
- `description` text
- `price` numeric
- `image_url` text (or array for multiple)
- `tags` text[] (restricted to the 7 allowed tags in UI)
- `location` text
- `lat` numeric null, `lng` numeric null
- `user_id` uuid (fk to `auth.users` or `profiles.id`)
- `status` text check in ('active','sold','inactive')
- `quantity` integer default 1
- timestamps

Profiles (`profiles`)
- `id` uuid (pk matches `auth.users.id`)
- `full_name` text
- `avatar_url` text
- `created_at` timestamp

Messaging (`conversations`, `messages`)
- `conversations`: `id` uuid pk, `created_at`, optional `listing_id`, etc.
- `conversation_participants`: `conversation_id`, `user_id`
- `messages`: `id` uuid pk, `conversation_id` fk, `sender_id` fk, `body` text, `created_at`

RLS Policies
- Users read public listings, write their own listings.
- Messages readable for conversation participants only; write restricted to participants.

Storage (optional for images)
- Bucket: `listing-images` with RLS allowing owner read/write, public read if desired.

---

### 4) Outstanding Work and Next Plan

1) UI Implementation from Provided Images (ASU maroon/gold, accessible, responsive)
- Apply final layouts/styles to all pages using `public/ui/*.png` as reference.
- Ensure consistent spacing, typography, button styles, and focus states.

2) Authentication with Supabase
- Implement Google OAuth login on `LoginPage.tsx` using Supabase Auth.
- Persist session in `AuthContext.tsx` and guard private routes.
- Password reset flows: Supabase magic link or OTP; wire `ResetPassword*` pages.

3) Listings CRUD with Supabase
- Hook `ExplorePage`, `MyListingsPage`, `NewListingPage` to Supabase tables.
- Implement tag filtering (limited to 7 tags), search, pagination.
- Image upload via Supabase Storage when creating/editing listings.

4) Messaging System (Conversations and Messages)
- Create `conversations`, `conversation_participants`, `messages` tables.
- Implement `/conversations` UI with real-time updates (Supabase Realtime) and `/messages` list view if needed.
- Only show Message button (no trade). CTA opens/creates a conversation with the seller.

5) Email Support API finalization
- Test OAuth2 and fallback SMTP in `src/pages/api/report-issue.ts`.
- Restrict allowed origins if deploying behind a domain.

6) Pages Migration Cleanup (optional but recommended)
- Replace `.tsx` pages in `src/pages/` with `.astro` route files that import React components via `client:only` or move `.tsx` under `src/components/`.
- This removes Astro warnings during build.

7) QA and Accessibility
- Keyboard navigation, focus rings, color contrast.
- 404/empty states, loading, and error messaging.

8) Deployment
- Keep `adapter: node({ mode: 'standalone' })` for portability.
- Target: Node host (e.g., Render/Fly/Heroku), or adapt to platform-specific adapters if moving to edge/serverless.

9) Documentation
- Update root `README.md` with full setup (env, schema, storage) after wiring is complete.

---

### 5) Commands and Day-2 Ops

Local run
```
npm install
npm run dev
```

Build & preview
```
npm run build
npm run preview
```

Git workflow (current)
```
git checkout -b asu-astro-supabase
git push -u origin asu-astro-supabase
```

---

### 6) File Map (Key Files)

- `astro.config.mjs` — Astro server output + Node adapter
- `tailwind.config.mjs` — ASU color palette
- `src/pages/index.astro` — mounts React `App` with `client:load`
- `src/components/App.tsx` — React Router routes
- `src/components/PersistentNav.tsx` + `.css` — top navigation
- `src/lib/supabase.ts` — Supabase client init + app types
- `src/pages/api/report-issue.ts` — Email support API (Nodemailer)
- `src/pages/api/auth/callback.ts` — Supabase OAuth callback
- `src/pages/*` — Page components (to be restyled to match `public/ui`)
- `src/env.d.ts` — env var types

---

### 7) References
- Repository: [ASU-Marketplace](https://github.com/Bhavya700/ASU-Marketplace)

---

If any page still shows legacy GT wording or behavior, note the route and file and it will be corrected immediately.


