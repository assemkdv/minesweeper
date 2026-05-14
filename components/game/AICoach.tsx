'use client';
import { useState } from 'react';
import { ProbabilityMap } from '@/lib/minesweeper';

export function AICoach({ probMap, showAI, onToggle, onHint, isDark, gameActive }: {
  probMap: ProbabilityMap|null; showAI:boolean; onToggle:()=>void;
  onHint:(cell:[number,number]|null)=>void; isDark:boolean; gameActive:boolean;
}) {
  const [open, setOpen] = useState(false);
  const c = { bg: isDark?'rgba(15,10,40,0.8)':'rgba(255,255,255,0.8)', border: isDark?'rgba(139,92,246,0.25)':'rgba(196,181,253,0.5)', text: isDark?'#e2d9f3':'#1e1b4b', muted: isDark?'#94a3b8':'#64748b' };
  const best=probMap?.bestMove, bestPct=probMap?Math.round(probMap.bestMoveProbability*100):null;
  return (
    <div style={{ background:c.bg, backdropFilter:'blur(16px)', border:`1px solid ${c.border}`, borderRadius:16, overflow:'hidden', width:'100%', maxWidth:300 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', cursor:'pointer', borderBottom:open?`1px solid ${c.border}`:'none' }} onClick={()=>setOpen(o=>!o)}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:20 }}>🤖</span>
          <span style={{ fontWeight:700, color:c.text, fontSize:14 }}>AI Coach</span>
          {showAI&&gameActive&&<span style={{ background:'linear-gradient(135deg,#8b5cf6,#ec4899)', color:'#fff', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:99 }}>LIVE</span>}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <button onClick={e=>{e.stopPropagation();onToggle();}} style={{
            background:showAI?'linear-gradient(135deg,#8b5cf6,#ec4899)':(isDark?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.08)'),
            color:showAI?'#fff':c.muted, border:'none', borderRadius:8,
            padding:'4px 12px', fontSize:12, fontWeight:700, cursor:'pointer',
            boxShadow:showAI?'0 2px 8px rgba(139,92,246,0.4)':'none',
          }}>{showAI?'ON':'OFF'}</button>
          <span style={{ color:c.muted, fontSize:11 }}>{open?'▲':'▼'}</span>
        </div>
      </div>
      {open&&(
        <div style={{ padding:'12px 14px', display:'flex', flexDirection:'column', gap:10 }}>
          {!gameActive?(
            <p style={{ color:c.muted, fontSize:13, margin:0 }}>Start a game to activate AI analysis ✨</p>
          ):!probMap||probMap.probs.size===0?(
            <p style={{ color:c.muted, fontSize:13, margin:0 }}>Click some cells to reveal the board — AI will analyze patterns!</p>
          ):(
            <>
              {best&&(
                <div style={{ background:isDark?'rgba(16,185,129,0.1)':'rgba(16,185,129,0.08)', border:`1px solid ${isDark?'rgba(16,185,129,0.3)':'rgba(16,185,129,0.3)'}`, borderRadius:10, padding:'10px 12px' }}>
                  <div style={{ fontSize:12, color:'#10b981', fontWeight:700, marginBottom:4 }}>⭐ Best Move</div>
                  <div style={{ fontSize:13, color:c.text }}>Row {best[0]+1}, Col {best[1]+1} <span style={{ color:c.muted }}>({bestPct}% risk)</span></div>
                  <button onClick={()=>onHint(best)} style={{ marginTop:8, background:'linear-gradient(135deg,#8b5cf6,#ec4899)', color:'#fff', border:'none', borderRadius:8, padding:'5px 14px', fontSize:12, fontWeight:700, cursor:'pointer', boxShadow:'0 2px 8px rgba(139,92,246,0.4)' }}>Highlight ✨</button>
                </div>
              )}
              {(probMap.safeCells.length>0)&&(
                <div style={{ background:isDark?'rgba(16,185,129,0.08)':'rgba(240,253,244,0.9)', border:'1px solid rgba(16,185,129,0.25)', borderRadius:10, padding:'8px 12px' }}>
                  <div style={{ fontSize:12, color:'#10b981', fontWeight:700, marginBottom:2 }}>✅ Safe cells ({probMap.safeCells.length})</div>
                  <div style={{ fontSize:12, color:c.muted }}>{probMap.safeCells.slice(0,5).map(([r,c])=>`(${r+1},${c+1})`).join(', ')}{probMap.safeCells.length>5?` +${probMap.safeCells.length-5}`:''}</div>
                </div>
              )}
              {(probMap.definiteMineCells.length>0)&&(
                <div style={{ background:isDark?'rgba(239,68,68,0.08)':'rgba(254,242,242,0.9)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:10, padding:'8px 12px' }}>
                  <div style={{ fontSize:12, color:'#ef4444', fontWeight:700, marginBottom:2 }}>💣 Mines ({probMap.definiteMineCells.length})</div>
                  <div style={{ fontSize:12, color:c.muted }}>{probMap.definiteMineCells.slice(0,5).map(([r,c])=>`(${r+1},${c+1})`).join(', ')}{probMap.definiteMineCells.length>5?` +${probMap.definiteMineCells.length-5}`:''}</div>
                </div>
              )}
              {showAI&&<div style={{ fontSize:11, color:c.muted }}>Overlay: 🟢 safe — 🟡 risky — 🔴 mine</div>}
            </>
          )}
        </div>
      )}
    </div>
  );
}
