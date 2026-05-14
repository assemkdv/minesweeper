'use client';
import { useState, useEffect, useCallback } from 'react';
import { useGame } from '@/hooks/useGame';
import { useTimer } from '@/hooks/useTimer';
import { getDailySeed, analyzeBoard, DIFFICULTIES } from '@/lib/minesweeper';
import { recordDaily, loadStats, formatTime } from '@/lib/storage';
import { Board, BOARD_GAP } from '@/components/game/Board';
import { GameHeader } from '@/components/game/GameHeader';
import { AICoach } from '@/components/game/AICoach';
import { Navbar } from '@/components/Navbar';

const CFG = DIFFICULTIES.intermediate;
function countdown(): string {
  const now=new Date(), midnight=new Date(); midnight.setUTCHours(24,0,0,0);
  const s=Math.max(0,Math.floor((midnight.getTime()-now.getTime())/1000));
  return `${String(Math.floor(s/3600)).padStart(2,'0')}:${String(Math.floor((s%3600)/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
}

export default function DailyPage() {
  const [isDark,setIsDark]=useState(false);
  const [seed]=useState(()=>getDailySeed());
  const [showAI,setShowAI]=useState(false);
  const [hinted,setHinted]=useState<[number,number]|null>(null);
  const [saved,setSaved]=useState(false);
  const [cd,setCd]=useState(countdown);
  const [cellSize,setCellSize]=useState(26);
  const [appStats,setAppStats]=useState(()=>loadStats());
  const [overlay,setOverlay]=useState<'won'|'lost'|null>(null);

  const game=useGame('intermediate',seed);
  const {elapsed,display}=useTimer(game.status,game.startTime,game.endTime);
  const probMap=analyzeBoard(game.board);

  useEffect(()=>{
    setIsDark(document.documentElement.classList.contains('dark'));
    const calc=()=>{ const maxW=Math.min(window.innerWidth-48,560); setCellSize(Math.max(16,Math.min(28,Math.floor((maxW-(CFG.cols-1)*BOARD_GAP)/CFG.cols)))); };
    calc(); window.addEventListener('resize',calc); return ()=>window.removeEventListener('resize',calc);
  },[]);

  useEffect(()=>{ const t=setInterval(()=>setCd(countdown()),1000); return ()=>clearInterval(t); },[]);

  useEffect(()=>{
    if((game.status==='won'||game.status==='lost')&&!saved){
      setSaved(true);
      setAppStats(recordDaily(game.status==='won',elapsed));
      setTimeout(()=>setOverlay(game.status as 'won'|'lost'),250);
    }
  },[game.status]);

  const toggle=()=>{const n=!isDark;setIsDark(n);document.documentElement.classList.toggle('dark',n);localStorage.setItem('theme',n?'dark':'light');};
  const handleReset=useCallback(()=>{game.reset();setHinted(null);setOverlay(null);setSaved(false);},[game]);

  const bg=isDark?'#0a0514':'#faf5ff';
  const boardW=CFG.cols*cellSize+(CFG.cols-1)*BOARD_GAP+8;

  return (
    <div style={{background:bg,minHeight:'100vh'}}>
      <Navbar isDark={isDark} onToggleTheme={toggle}/>
      <main style={{padding:'20px 16px',display:'flex',flexDirection:'column',alignItems:'center',gap:16}}>
        <div style={{
          background:isDark?'rgba(109,40,217,0.15)':'rgba(196,181,253,0.25)',
          backdropFilter:'blur(16px)',
          border:`1px solid ${isDark?'rgba(139,92,246,0.3)':'rgba(196,181,253,0.6)'}`,
          borderRadius:20,padding:'20px 28px',textAlign:'center',maxWidth:480,width:'100%',
        }}>
          <div style={{fontSize:36,marginBottom:8}}>📅</div>
          <h1 style={{fontWeight:900,fontSize:24,background:'linear-gradient(135deg,#8b5cf6,#ec4899)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',marginBottom:4}}>Daily Challenge</h1>
          <p style={{color:isDark?'#c4b5fd':'#6d28d9',fontSize:14,marginBottom:6}}>{new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
          <p style={{color:isDark?'#94a3b8':'#7e22ce',fontSize:13,marginBottom:8}}>Everyone plays the same board today 🌍</p>
          <div style={{fontSize:12,color:isDark?'#a78bfa':'#7c3aed',fontWeight:700}}>Next challenge in: {cd}</div>
        </div>

        <div style={{display:'flex',gap:20,flexWrap:'wrap',justifyContent:'center',alignItems:'flex-start'}}>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
            <div className="animate-glow" style={{
              background:isDark?'linear-gradient(145deg,#2e1065,#1e1b4b)':'linear-gradient(145deg,#7c3aed,#6d28d9)',
              padding:12,borderRadius:20,
              boxShadow:isDark?'0 20px 60px rgba(76,29,149,0.6)':'0 20px 60px rgba(109,40,217,0.4)',
              position:'relative',
            }}>
              <div style={{width:boardW}}>
                <GameHeader minesLeft={game.minesLeft} timerDisplay={display} status={game.status} onReset={handleReset} isDark={isDark}/>
              </div>
              <Board board={game.board} cellSize={cellSize} probMap={showAI?probMap:null} showAI={showAI} hintedCell={hinted} gameOver={game.status==='won'||game.status==='lost'} isDark={isDark} onCellClick={game.handleClick} onCellRightClick={game.handleRightClick} onCellDoubleClick={game.handleChord}/>
              {overlay&&(
                <div className="animate-fade-in" style={{position:'absolute',inset:0,borderRadius:20,background:'rgba(0,0,0,0.72)',backdropFilter:'blur(8px)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:10}}>
                  <div className="animate-pop" style={{fontSize:56}}>{overlay==='won'?'🎉':'💥'}</div>
                  <div style={{fontSize:24,fontWeight:900,color:'#fff'}}>{overlay==='won'?'Daily Complete!':'Try Again!'}</div>
                  {overlay==='won'&&<>
                    <div style={{color:'#c4b5fd',fontWeight:600}}>Time: {display}s</div>
                    <div style={{color:'#a5b4fc',fontSize:14}}>🔥 {appStats.dailyStreak}-day streak!</div>
                  </>}
                  <button onClick={handleReset} style={{background:'linear-gradient(135deg,#8b5cf6,#ec4899)',color:'#fff',border:'none',borderRadius:12,padding:'11px 26px',fontSize:14,fontWeight:800,cursor:'pointer',boxShadow:'0 4px 16px rgba(139,92,246,0.5)',marginTop:4}}>Play Again ✨</button>
                </div>
              )}
            </div>
            <div style={{marginTop:8,fontSize:12,color:isDark?'#6d28d9':'#94a3b8',textAlign:'center'}}>Right-click / long-press to flag</div>
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:12,maxWidth:300,width:'100%'}}>
            <AICoach probMap={game.status==='playing'?probMap:null} showAI={showAI} onToggle={()=>{setShowAI(v=>!v);setHinted(null);}} onHint={setHinted} isDark={isDark} gameActive={game.status==='playing'}/>
            <div style={{background:isDark?'rgba(15,10,40,0.8)':'rgba(255,255,255,0.8)',backdropFilter:'blur(16px)',border:`1px solid ${isDark?'rgba(139,92,246,0.25)':'rgba(196,181,253,0.5)'}`,borderRadius:16,padding:'12px 14px'}}>
              <div style={{fontWeight:700,color:isDark?'#e2d9f3':'#1e1b4b',fontSize:14,marginBottom:10}}>📅 Daily Stats</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
                {[{label:'Streak',value:`${appStats.dailyStreak} 🔥`},{label:'Best',value:appStats.dailyBestTime?formatTime(appStats.dailyBestTime):'—'}].map(({label,value})=>(
                  <div key={label} style={{background:isDark?'rgba(0,0,0,0.3)':'rgba(255,255,255,0.6)',borderRadius:10,padding:'7px 10px',border:`1px solid ${isDark?'rgba(139,92,246,0.25)':'rgba(196,181,253,0.5)'}`}}>
                    <div style={{fontSize:10,color:isDark?'#94a3b8':'#64748b',fontWeight:600,textTransform:'uppercase',letterSpacing:0.5}}>{label}</div>
                    <div style={{fontSize:18,fontWeight:900,background:'linear-gradient(135deg,#8b5cf6,#ec4899)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',marginTop:2}}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
