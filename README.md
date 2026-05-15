# Mineko

**Live site:** https://minesweeper-omega-ten.vercel.app/

Mineko is a Minesweeper web app I built from scratch. It has an AI coach, daily challenges, a real leaderboard connected to a database, and a clean design that works on both desktop and mobile.

## What's inside

**The game**
- Three difficulty levels: Beginner, Intermediate, Expert
- Your first click is always safe — mines are placed after you click
- Right-click or long-press to flag a cell
- Double-click to chord (auto-clear neighbors when mines are flagged)

**AI Coach**
- Toggle it on and it overlays each hidden cell with its mine probability
- Green = safe to click, yellow = risky, red = definitely a mine
- It uses constraint-based logic — the same way experienced players think
- Highlights the single best move if you want a hint

**Daily Challenge**
- Same board for everyone in the world, every day
- You can only play it once — no retrying after you finish
- Tracks your streak across days
- If you finish without using any hints, you get a "No hints" badge on the leaderboard

**Leaderboard**
- Real scores saved to Supabase
- Sorted by fastest time per difficulty
- Shows "No hints" badge next to players who didn't use the AI
- Your personal best is shown at the top

**Accounts**
- Sign up / sign in with email via Supabase Auth
- If you're not signed in, you get a guest username that's saved locally

**Design**
- Pink kawaii theme with a cat mascot (Mineko)
- Dark mode that actually works
- Mobile-friendly with a hamburger menu on small screens
- Cat mascot changes expression based on the game state (idle, playing, won, lost)

**Mineko Pro** (work in progress)
- Subscription page with monthly/yearly pricing
- Skin vault with custom board themes
- Stripe integration coming later

## Tech stack

- Next.js 14 (App Router) + TypeScript
- Supabase for auth and the scores database
- CSS variables for theming, inline styles throughout
- localStorage for local stats (games played, win rate, streaks)
- Deployed on Vercel

## Running locally

```bash
npm install
npm run dev
```

Create a `.env.local` file with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

For the leaderboard to work you also need to create the scores table in Supabase SQL Editor:

```sql
create table if not exists public.scores (
  id uuid default gen_random_uuid() primary key,
  username text not null,
  difficulty text not null check (difficulty in ('beginner','intermediate','expert','daily')),
  time_ms integer not null,
  no_hints boolean not null default false,
  created_at timestamptz default now()
);
alter table scores enable row level security;
create policy "Anyone can read scores" on scores for select to anon, authenticated using (true);
create policy "Anyone can insert scores" on scores for insert to anon, authenticated with check (true);
```
