# Mineko

**Play here:** https://minesweeper-omega-ten.vercel.app/

Mineko is a modern Minesweeper platform built for the nFactorial Incubator.

Classic Minesweeper is fun but it has a problem — at some point you're just guessing. Mineko fixes that. It's built for people who want to actually get good at the game: an AI coach shows you the mine probability of every cell in real time, so every move is a decision, not a coin flip. Daily challenges give you a reason to come back every day, and a live leaderboard makes your times mean something.

It's free to play, works on any device, and doesn't require an account to start.

## Features

**Core game**
- Beginner, Intermediate, and Expert difficulty
- First click is always safe
- Right-click or long-press to flag, double-click to chord

**AI Coach**
- Shows the mine probability of every hidden cell in real time
- Color-coded overlay: green = safe, yellow = risky, red = mine
- Uses constraint-based logic, the same way experienced players think
- Can highlight the single best move as a hint

**Daily Challenge**
- Same board for every player worldwide, resets at midnight UTC
- One attempt per day — no retrying after you finish
- Tracks your daily streak
- "No hints" badge on the leaderboard if you finish without using the AI

**Leaderboard**
- Real scores saved to a database
- Ranked by fastest time per difficulty
- Shows no-hints badge next to clean runs

**Accounts**
- Sign up and sign in with email
- Scores are saved under your username
- Guest players get an auto-generated name

**Design**
- Pink kawaii theme with a cat mascot
- Dark mode
- Mobile responsive with hamburger menu
- Cat mascot reacts to game state (idle, playing, won, lost)

## Stack

- Next.js 14 + TypeScript
- Supabase (auth + database)
- Vercel (hosting)
