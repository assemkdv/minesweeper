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
function cd():string{
  const now=new Date(),m=new Date();m.setUTCHours(24,0,0,0);
  const s=Math.max(0,Math.floor((m.getTime()-now.getTime())/1000));
  return `${String(Math.floor(s/3600)).padStart(2,'0')}:${String(Math.floor((s%3600)/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
}

export default function DailyPage() {
  const [isDark,setIsDark]=useState(false);
  const [seed]=useState(()=>getDailySeed());
  const [showAI,setShowAI]=useState(false);
  const [hinted,setHinted]=useState<[number,number]|null>(null);
  const [saved,setSaved]=useState(false);
  const [countdown,setCd]=useState(cd);
  const [sz,setSz]=useState(26);
  const [appStats,setAppStats]=useState(()=>loadStats());
  const [overlay,setOverlay]=useState<'won'|'lost'|null>(null);

  const game=useGame('intermediate',seed);
  const {elapsed,display}=useTimer(game.status,game.startTime,game.endTime);
  const probMap=analyzeBoard(game.board);

  useEffect(()=>{
    setIsDark(document.documentElement.classList.contains('dark'));
    const calc=()=>setSz(Math.max(16,Math.min(28,Math.floor((Math.min(window.innerWidth-48,560)-(CFG.cols-1)*BOARD_GAP)/CFG.cols))));
    calc(); window.addEventListener('resize',calc); return()=>window.removeEventListener('resize',calc);
  },[]);
  useEffect(()=>{ const t=setInterval(()=>setCd(cd()),1000); return()=>clearInterval(t); },[]);
  useEffect(()=>{
    if((game.status==='won'||game.status==='lost')&&!saved){
      setSaved(true); setAppStats(recordDaily(game.status==='won',elapsed));
      setTimeout(()=>setOverlay(game.status as 'won'|'lost'),250);
    }
  },[game.status]);

  const toggle=()=>{const n=!isDark;setIsDark(n);document.documentElement.classList.toggle('dark',n);localStorage.setItem('theme',n?'dark':'light');};
  const handleReset=useCallback(()=>{game.reset();setHinted(null);setOverlay(null);setSaved(false);},[game]);

  const bg  = isDark?'#111':'#fefcf8';
  const bdr = isDark?'#222':'#e8ddd0';
  const boardW = CFG.cols*sz+(CFG.cols-1)*BOARD_GAP+8;

  return (
    <div style={{background:bg,minHeight:'100vh'}}>
      <Navbar isDark={isDark} onToggleTheme={toggle}/>
      <main style={{padding:'20px 16px',display:'flex',flexDirection:'column',alignItems:'center',gap:16}}>

        <div style={{background:isDark?'#1a1a1a':'#fff7ed',border:`1px solid ${isDark?'#2a2a2a':'#fed7aa'}`,borderRadius:16,padding:'18px 24px',textAlign:'center',maxWidth:460,width:'100%'}}>
          <div style={{fontSize:32,marginBottom:6}}>📅</div>
          <h1 style={{fontWeight:900,fontSize:22,color:isDark?'#f0f0f0':'#1a1a1a',marginBottom:4}}>Daily Challenge</h1>
          <p style={{color:isDark?'#888':'#92400e',fontSize:13,marginBottom:4}}>
            {new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}
          </p>
          <p style={{color:isDark?'#666':'#b45309',fontSize:12,marginBottom:6}}>Same board for everyone today 🌍</p>
          <div style={{fontSize:12,color:isDark?'#ea580c':'#ea580c',fontWeight:700}}>Next puzzle in {countdown}</div>
        </div>

        <div style={{display:'flex',gap:20,flexWrap:'wrap',justifyContent:'center',alignItems:'flex-start'}}>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
            <div style={{background:isDark?'#1a1a1a':'#fff',border:`1px solid ${bdr}`,borderRadius:16,padding:12,boxShadow:isDark?'0 8px 32px rgba(0,0,0,0.5)':'0 8px 32px rgba(0,0,0,0.08)',position:'relative'}}>
              <div style={{width:boardW}}>
                <GameHeader minesLeft={game.minesLeft} timerDisplay={display} status={game.status} onReset={handleReset} isDark={isDark}/>
              </div>
              <Board board={game.board} cellSize={sz} probMap={showAI?probMap:null} showAI={showAI} hintedCell={hinted} gameOver={game.status==='won'||game.status==='lost'} isDark={isDark} onCellClick={game.handleClick} onCellRightClick={game.handleRightClick} onCellDoubleClick={game.handleChord}/>
              {overlay&&(
                <div className="anim-fadeup" style={{position:'absolute',inset:0,borderRadius:16,background:'rgba(0,0,0,0.65)',backdropFilter:'blur(6px)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:10}}>
                  <div className="anim-pop" style={{fontSize:52}}>{overlay==='won'?'🎉':'💥'}</div>
                  <div style={{fontSize:22,fontWeight:900,color:'#fff'}}>{overlay==='won'?'Daily complete!':'Try again!'}</div>
                  {overlay==='won'&&<>
                    <div style={{color:'#fde68a',fontWeight:600}}>{display}s</div>
                    <div style={{color:'#fde68a',fontSize:13}}>🔥 {appStats.dailyStreak}-day streak</div>
                  </>}
                  <button onClick={handleReset} style={{background:'#e8533a',color:'#fff',border:'none',borderRadius:10,padding:'10px 26px',fontSize:14,fontWeight:800,cursor:'pointer',marginTop:4}}>Play again</button>
                </div>
              )}
            </div>
            <div style={{marginTop:8,fontSize:12,color:isDark?'#555':'#bbb',textAlign:'center'}}>Long-press to flag on mobile</div>
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:12,maxWidth:280,width:'100%'}}>
            <AICoach probMap={game.status==='playing'?probMap:null} showAI={showAI} onToggle={()=>{setShowAI(v=>!v);setHinted(null);}} onHint={setHinted} isDark={isDark} gameActive={game.status==='playing'}/>
            <div style={{background:isDark?'#1a1a1a':'#fff',border:`1px solid ${bdr}`,borderRadius:14,padding:'12px 14px'}}>
              <div style={{fontWeight:700,color:isDark?'#f0f0f0':'#1a1a1a',fontSize:14,marginBottom:10}}>📅 Daily Stats</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
                {[{l:'Streak',v:`${appStats.dailyStreak} 🔥`},{l:'Best',v:appStats.dailyBestTime?formatTime(appStats.dailyBestTime):'—'}].map(({l,v})=>(
                  <div key={l} style={{background:isDark?'#111':'#faf6f1',border:`1px solid ${bdr}`,borderRadius:10,padding:'7px 10px'}}>
                    <div style={{fontSize:10,color:isDark?'#666':'#999',fontWeight:600,textTransform:'uppercase',letterSpacing:0.5}}>{l}</div>
                    <div style={{fontSize:18,fontWeight:900,color:'#e8533a',marginTop:2}}>{v}</div>
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
