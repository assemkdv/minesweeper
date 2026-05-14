'use client';
import { Difficulty, DIFFICULTIES } from '@/lib/minesweeper';
export function DifficultySelector({ current, onChange, isDark }: { current:Difficulty; onChange:(d:Difficulty)=>void; isDark:boolean }) {
  return (
    <div style={{ display:'flex', gap:6, flexWrap:'wrap', justifyContent:'center',
      background: isDark?'rgba(0,0,0,0.3)':'rgba(255,255,255,0.5)',
      backdropFilter:'blur(10px)', padding:6, borderRadius:16,
      border:`1px solid ${isDark?'rgba(139,92,246,0.2)':'rgba(196,181,253,0.4)'}` }}>
      {(Object.entries(DIFFICULTIES) as [Difficulty, typeof DIFFICULTIES[Difficulty]][]).map(([key,cfg])=>(
        <button key={key} onClick={()=>onChange(key)} style={{
          padding:'7px 18px', borderRadius:12, border:'none', fontWeight:700, fontSize:13,
          cursor:'pointer', transition:'all 0.15s',
          background: current===key ? 'linear-gradient(135deg,#8b5cf6,#ec4899)' : (isDark?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.05)'),
          color: current===key ? '#fff' : (isDark?'#94a3b8':'#6b7280'),
          boxShadow: current===key ? '0 4px 12px rgba(139,92,246,0.4)' : 'none',
        }}>
          {cfg.label} <span style={{ opacity:0.65, fontSize:11, marginLeft:4 }}>{cfg.rows}×{cfg.cols}</span>
        </button>
      ))}
    </div>
  );
}
