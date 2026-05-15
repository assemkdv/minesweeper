'use client';
import { useState, useEffect } from 'react';
import { DifficultyStats, formatTime, getWinRate } from '@/lib/storage';
import { Difficulty } from '@/lib/minesweeper';

export function StatsPanel({ stats, difficulty, isDark }: { stats: Record<string,DifficultyStats>; difficulty: Difficulty; isDark: boolean }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const d = stats[difficulty];
  if (!d || !mounted) return null;

  const items = [
    { label: 'Games',       value: d.gamesPlayed },
    { label: 'Wins',        value: d.wins },
    { label: 'Win Rate',    value: `${getWinRate(d)}%` },
    { label: 'Best Time',   value: d.bestTime ? formatTime(d.bestTime) : '—' },
    { label: 'Streak',      value: d.currentStreak },
    { label: 'Best Streak', value: d.bestStreak },
  ];

  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '12px 14px' }}>
      <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 14, marginBottom: 10 }}>Your Stats</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {items.map(({ label, value }) => (
          <div key={label} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '7px 10px' }}>
            <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--btn)', marginTop: 2 }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
