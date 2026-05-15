'use client';
import { useState } from 'react';
import { ProbabilityMap } from '@/lib/minesweeper';

export function AICoach({ probMap, showAI, onToggle, onHint, isDark, gameActive }: {
  probMap: ProbabilityMap|null; showAI:boolean; onToggle:()=>void;
  onHint:(cell:[number,number]|null)=>void; isDark:boolean; gameActive:boolean;
}) {
  const [open, setOpen] = useState(false);
  const bg     = isDark ? '#1a1a1a' : '#fff';
  const border = isDark ? '#2a2a2a' : '#e5ddd5';
  const text   = isDark ? '#f0f0f0' : '#1a1a1a';
  const muted  = isDark ? '#666'    : '#999';
  const best   = probMap?.bestMove;
  const pct    = probMap ? Math.round(probMap.bestMoveProbability*100) : null;
  return (
    <div style={{ background:bg, border:`1px solid ${border}`, borderRadius:14, overflow:'hidden' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', cursor:'pointer', borderBottom: open?`1px solid ${border}`:'none' }}
        onClick={()=>setOpen(o=>!o)}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:18 }}>🤖</span>
          <span style={{ fontWeight:700, color:text, fontSize:14 }}>AI Coach</span>
          {showAI&&gameActive&&<span style={{ background:'#e8533a', color:'#fff', fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:99 }}>LIVE</span>}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <button onClick={e=>{e.stopPropagation();onToggle();}} style={{
            background: showAI ? '#e8533a' : (isDark?'#222':'#f0ebe4'),
            color: showAI ? '#fff' : muted,
            border:'none', borderRadius:7, padding:'4px 12px',
            fontSize:12, fontWeight:700, cursor:'pointer', transition:'all 0.15s',
            boxShadow: showAI ? '0 2px 8px rgba(232,83,58,0.4)' : 'none',
          }}>{showAI?'ON':'OFF'}</button>
          <span style={{ color:muted, fontSize:11 }}>{open?'▲':'▼'}</span>
        </div>
      </div>
      {open&&(
        <div style={{ padding:'12px 14px', display:'flex', flexDirection:'column', gap:10 }}>
          {!gameActive ? (
            <p style={{ color:muted, fontSize:13, margin:0 }}>Start a game to activate AI analysis.</p>
          ) : !probMap||probMap.probs.size===0 ? (
            <p style={{ color:muted, fontSize:13, margin:0 }}>Click a few cells — AI will map the board!</p>
          ) : (
            <>
              {best&&(
                <div style={{ background:isDark?'rgba(22,163,74,0.1)':'#f0fdf4', border:`1px solid ${isDark?'rgba(22,163,74,0.25)':'#bbf7d0'}`, borderRadius:10, padding:'10px 12px' }}>
                  <div style={{ fontSize:12, color:'#16a34a', fontWeight:700, marginBottom:4 }}>⭐ Best move</div>
                  <div style={{ fontSize:13, color:text }}>Row {best[0]+1}, Col {best[1]+1} <span style={{ color:muted }}>({pct}% risk)</span></div>
                  <button onClick={()=>onHint(best)} style={{ marginTop:8, background:'#e8533a', color:'#fff', border:'none', borderRadius:7, padding:'5px 14px', fontSize:12, fontWeight:700, cursor:'pointer' }}>Highlight →</button>
                </div>
              )}
              {probMap.safeCells.length>0&&(
                <div style={{ background:isDark?'rgba(22,163,74,0.08)':'#f0fdf4', border:`1px solid ${isDark?'rgba(22,163,74,0.2)':'#86efac'}`, borderRadius:10, padding:'8px 12px' }}>
                  <div style={{ fontSize:12, color:'#16a34a', fontWeight:700, marginBottom:2 }}>✅ Safe ({probMap.safeCells.length})</div>
                  <div style={{ fontSize:12, color:muted }}>{probMap.safeCells.slice(0,5).map(([r,c])=>`(${r+1},${c+1})`).join(', ')}{probMap.safeCells.length>5?` +${probMap.safeCells.length-5}`:''}</div>
                </div>
              )}
              {probMap.definiteMineCells.length>0&&(
                <div style={{ background:isDark?'rgba(220,38,38,0.08)':'#fef2f2', border:`1px solid ${isDark?'rgba(220,38,38,0.2)':'#fca5a5'}`, borderRadius:10, padding:'8px 12px' }}>
                  <div style={{ fontSize:12, color:'#dc2626', fontWeight:700, marginBottom:2 }}>💣 Mines ({probMap.definiteMineCells.length})</div>
                  <div style={{ fontSize:12, color:muted }}>{probMap.definiteMineCells.slice(0,5).map(([r,c])=>`(${r+1},${c+1})`).join(', ')}{probMap.definiteMineCells.length>5?` +${probMap.definiteMineCells.length-5}`:''}</div>
                </div>
              )}
              {showAI&&<div style={{ fontSize:11, color:muted }}>Overlay: 🟢 safe — 🟡 risky — 🔴 mine</div>}
            </>
          )}
        </div>
      )}
    </div>
  );
}
