'use client';
import { DifficultyStats, formatTime, getWinRate } from '@/lib/storage';
import { Difficulty } from '@/lib/minesweeper';

export function StatsPanel({ stats, difficulty, isDark }: { stats:Record<string,DifficultyStats>; difficulty:Difficulty; isDark:boolean }) {
  const d = stats[difficulty];
  if (!d) return null;
  const bg     = isDark ? '#1a1a1a' : '#fff';
  const border = isDark ? '#2a2a2a' : '#e5ddd5';
  const text   = isDark ? '#f0f0f0' : '#1a1a1a';
  const muted  = isDark ? '#666'    : '#999';
  const inner  = isDark ? '#111'    : '#faf6f1';
  const items = [
    { label:'Games',       value: d.gamesPlayed },
    { label:'Wins',        value: d.wins },
    { label:'Win Rate',    value: `${getWinRate(d)}%` },
    { label:'Best Time',   value: d.bestTime ? formatTime(d.bestTime) : '—' },
    { label:'Streak',      value: d.currentStreak },
    { label:'Best Streak', value: d.bestStreak },
  ];
  return (
    <div style={{ background:bg, border:`1px solid ${border}`, borderRadius:14, padding:'12px 14px' }}>
      <div style={{ fontWeight:700, color:text, fontSize:14, marginBottom:10 }}>📊 Your Stats</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
        {items.map(({label,value})=>(
          <div key={label} style={{ background:inner, border:`1px solid ${border}`, borderRadius:10, padding:'7px 10px' }}>
            <div style={{ fontSize:10, color:muted, fontWeight:600, textTransform:'uppercase', letterSpacing:0.5 }}>{label}</div>
            <div style={{ fontSize:17, fontWeight:800, color:'#e8533a', marginTop:2 }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
