# Zakie

A demo that generates the same brand guidelines twice: once from a stored, structured
business profile, once from a blank prompt. That single comparison is the point of the
app. Demo only — no accounts, no billing, no payments.

## Stack

Next.js (App Router) · TypeScript · Tailwind · Supabase · OpenAI · Vercel

## Setup

```bash
npm install
cp .env.example .env.local   # fill in the four values
npm run dev
```

Then open `/status` to confirm the database connection.

## Environment

| Variable | Used for |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side database access |
| `OPENAI_API_KEY` | Generation, server-side only |

## Database

The `business_profiles` and `assets` tables already exist in Supabase; the app never
creates, drops or migrates them. Row level security is enabled with no policies, so all
access goes through server-side code using the service role key — the browser never
talks to Supabase. A database trigger bumps `version` and `updated_at`, so the app does
not manage versioning itself.
