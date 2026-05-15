'use client';
import { Difficulty, DIFFICULTIES } from '@/lib/minesweeper';

export function DifficultySelector({ current, onChange, isDark }: { current:Difficulty; onChange:(d:Difficulty)=>void; isDark:boolean }) {
  const bg     = isDark ? '#1a1a1a' : '#fff';
  const border = isDark ? '#2a2a2a' : '#e5ddd5';
  const muted  = isDark ? '#666' : '#999';
  return (
    <div style={{ display:'flex', gap:6, background:bg, border:`1px solid ${border}`, borderRadius:12, padding:5 }}>
      {(Object.entries(DIFFICULTIES) as [Difficulty,typeof DIFFICULTIES[Difficulty]][]).map(([key,cfg])=>(
        <button key={key} onClick={()=>onChange(key)} style={{
          padding:'7px 18px', borderRadius:8, border:'none',
          fontWeight:700, fontSize:13, cursor:'pointer', transition:'all 0.15s',
          background: current===key ? '#e8533a' : 'transparent',
          color:       current===key ? '#fff'    : muted,
          boxShadow:   current===key ? '0 3px 10px rgba(232,83,58,0.4)' : 'none',
        }}>
          {cfg.label} <span style={{ opacity:0.65, fontSize:11 }}>{cfg.rows}×{cfg.cols}</span>
        </button>
      ))}
    </div>
  );
}
