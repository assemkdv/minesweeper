'use client';
import { GameStatus } from '@/lib/minesweeper';

export function GameHeader({ minesLeft, timerDisplay, status, onReset, isDark }: {
  minesLeft: number; timerDisplay: string; status: GameStatus; onReset: ()=>void; isDark: boolean;
}) {
  const face = status==='won' ? '🥳' : status==='lost' ? '😵' : '🙂';
  const bg     = isDark ? '#1a1a1a' : '#fff';
  const border = isDark ? '#2a2a2a' : '#e5ddd5';
  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'space-between',
      background: bg, border:`1px solid ${border}`,
      borderRadius:12, padding:'8px 12px', marginBottom:8,
    }}>
      <LCD value={String(Math.max(-99,Math.min(999,minesLeft))).padStart(3,'0')} isDark={isDark}/>
      <button onClick={onReset} title="New game" style={{
        width:44, height:44, fontSize:24,
        display:'flex', alignItems:'center', justifyContent:'center',
        background: 'linear-gradient(145deg,#fde68a,#fbbf24)',
        border:'none', borderRadius:'50%', cursor:'pointer',
        boxShadow:'0 3px 10px rgba(251,191,36,0.45)',
        transition:'transform 0.1s, box-shadow 0.1s',
      }}
        onMouseDown={e=>{e.currentTarget.style.transform='scale(0.9)';e.currentTarget.style.boxShadow='0 1px 4px rgba(251,191,36,0.3)';}}
        onMouseUp={e=>{e.currentTarget.style.transform='scale(1)';e.currentTarget.style.boxShadow='0 3px 10px rgba(251,191,36,0.45)';}}
        onMouseLeave={e=>{e.currentTarget.style.transform='scale(1)';e.currentTarget.style.boxShadow='0 3px 10px rgba(251,191,36,0.45)';}}>
        {face}
      </button>
      <LCD value={timerDisplay} isDark={isDark}/>
    </div>
  );
}

function LCD({ value, isDark }: { value:string; isDark:boolean }) {
  return (
    <div style={{
      background: '#111', color:'#fbbf24',
      fontFamily:'"Courier New",monospace', fontSize:22, fontWeight:900,
      padding:'4px 10px', letterSpacing:4, borderRadius:8,
      minWidth:70, textAlign:'right',
      boxShadow:'inset 0 2px 4px rgba(0,0,0,0.6)',
      border:'1px solid #222',
    }}>{value}</div>
  );
}
