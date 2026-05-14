'use client';
import { DifficultyStats, formatTime, getWinRate } from '@/lib/storage';
import { Difficulty } from '@/lib/minesweeper';

export function StatsPanel({ stats, difficulty, isDark }: { stats: Record<string,DifficultyStats>; difficulty:Difficulty; isDark:boolean }) {
  const d = stats[difficulty];
  if (!d) return null;
  const c = { bg:isDark?'rgba(15,10,40,0.8)':'rgba(255,255,255,0.8)', border:isDark?'rgba(139,92,246,0.25)':'rgba(196,181,253,0.5)', text:isDark?'#e2d9f3':'#1e1b4b', muted:isDark?'#94a3b8':'#64748b', inner:isDark?'rgba(0,0,0,0.3)':'rgba(255,255,255,0.6)' };
  const items = [
    { label:'Games', value:d.gamesPlayed },
    { label:'Wins', value:d.wins },
    { label:'Win Rate', value:`${getWinRate(d)}%` },
    { label:'Best Time', value:d.bestTime?formatTime(d.bestTime):'—' },
    { label:'Streak', value:d.currentStreak },
    { label:'Best Streak', value:d.bestStreak },
  ];
  return (
    <div style={{ background:c.bg, backdropFilter:'blur(16px)', border:`1px solid ${c.border}`, borderRadius:16, padding:'12px 14px', width:'100%', maxWidth:300 }}>
      <div style={{ fontWeight:700, color:c.text, fontSize:14, marginBottom:10 }}>📊 Your Stats</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
        {items.map(({label,value})=>(
          <div key={label} style={{ background:c.inner, borderRadius:10, padding:'7px 10px', border:`1px solid ${c.border}` }}>
            <div style={{ fontSize:10, color:c.muted, fontWeight:600, textTransform:'uppercase', letterSpacing:0.5 }}>{label}</div>
            <div style={{ fontSize:17, fontWeight:800, color:'#8b5cf6', marginTop:2 }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
