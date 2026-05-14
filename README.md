# 💣 MinesweeperPro

> The smartest Minesweeper on the web — train probabilistic thinking with AI-powered hints and daily challenges.

## What is this?

MinesweeperPro is a **modern Minesweeper platform** designed to be *mastered*, not just played:

- 🤖 **AI Coach** — real-time probability overlay shows exact mine risk per cell
- 📅 **Daily Challenge** — seeded board, same for every player worldwide
- 🏆 **Global Leaderboard** — best times across all difficulty levels
- 📊 **Deep Stats** — win rate, streaks, best times, all in localStorage (no signup needed)
- 🎨 **Cute modern design** — gradient purple palette, glass morphism cards, dark/light mode
- 📱 **Mobile-friendly** — long-press to flag, responsive cell sizing

## Quick Start

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Features

| Feature | Status |
|---|---|
| Full game logic (flood fill, chord, flag) | ✅ |
| Beginner / Intermediate / Expert | ✅ |
| First-click always safe | ✅ |
| AI Coach (probability overlay + best move) | ✅ |
| Daily Challenge (date-seeded) | ✅ |
| Countdown to next challenge | ✅ |
| Stats in localStorage | ✅ |
| Leaderboard (mock + Supabase-ready) | ✅ |
| Dark / Light mode | ✅ |
| Mobile responsive + touch support | ✅ |
| Pro upgrade CTA | ✅ |

## How AI Coach Works

Constraint-based probability analysis (no ML needed):
1. For each revealed numbered cell, counts remaining mines among hidden neighbors
2. If `remaining == hidden_count` → all are definite mines
3. If `remaining == 0` → all are definitely safe
4. Otherwise assigns `remaining/hidden_count` probability to each
5. Color overlay: 🟢 green = safe — 🟡 yellow = risky — 🔴 red = mine

This is exactly how expert humans think — the AI teaches you *how to reason*, not just what to click.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** + inline styles for dynamic theming
- **localStorage** for stats (no backend required)
- **Supabase-ready** — add `.env.local` to enable real leaderboard

## Business Potential

- **Free**: Full game, daily challenge, stats, leaderboard
- **Pro ($3.99/mo)**: Custom themes, advanced AI, priority leaderboard, no ads
- **Retention**: Daily streak creates daily active users
- **SEO**: Low-competition keywords: "Minesweeper with AI", "daily Minesweeper"

---

Built with ❤️ for probabilistic thinkers. The world needs people comfortable with uncertainty.
