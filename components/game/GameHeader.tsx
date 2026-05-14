'use client';
import { GameStatus } from '@/lib/minesweeper';

export function GameHeader({ minesLeft, timerDisplay, status, onReset, isDark }: {
  minesLeft: number; timerDisplay: string; status: GameStatus; onReset: ()=>void; isDark: boolean;
}) {
  const face = status==='won' ? '🤩' : status==='lost' ? '😵‍💫' : '🙂';
  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'8px 12px', marginBottom:8, borderRadius:14,
      background: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.25)',
      backdropFilter:'blur(10px)',
      border:`1px solid ${isDark?'rgba(139,92,246,0.2)':'rgba(196,181,253,0.4)'}`,
    }}>
      <LCD value={String(Math.max(-99,Math.min(999,minesLeft))).padStart(3,'0')} />
      <button onClick={onReset} title="New game" style={{
        width:46, height:46, fontSize:26,
        display:'flex', alignItems:'center', justifyContent:'center',
        background:'linear-gradient(145deg,#fcd34d,#f59e0b)',
        border:'none', borderRadius:'50%', cursor:'pointer',
        boxShadow:'0 4px 14px rgba(245,158,11,0.5)', transition:'transform 0.1s,box-shadow 0.1s',
      }}
        onMouseDown={e=>{e.currentTarget.style.transform='scale(0.88)';e.currentTarget.style.boxShadow='0 2px 6px rgba(245,158,11,0.3)';}}
        onMouseUp={e=>{e.currentTarget.style.transform='scale(1)';e.currentTarget.style.boxShadow='0 4px 14px rgba(245,158,11,0.5)';}}
        onMouseLeave={e=>{e.currentTarget.style.transform='scale(1)';e.currentTarget.style.boxShadow='0 4px 14px rgba(245,158,11,0.5)';}}>
        {face}
      </button>
      <LCD value={timerDisplay} />
    </div>
  );
}

function LCD({ value }: { value: string }) {
  return (
    <div style={{
      background:'#050a05', color:'#4ade80',
      fontFamily:'"Courier New",monospace', fontSize:22, fontWeight:900,
      padding:'4px 10px', letterSpacing:4, borderRadius:10,
      minWidth:72, textAlign:'right',
      boxShadow:'0 0 12px rgba(74,222,128,0.25),inset 0 2px 4px rgba(0,0,0,0.7)',
      border:'1px solid rgba(74,222,128,0.15)',
    }}>{value}</div>
  );
}
