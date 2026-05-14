'use client';
import { useState, useEffect, useCallback } from 'react';
import { useGame } from '@/hooks/useGame';
import { useTimer } from '@/hooks/useTimer';
import { analyzeBoard, Difficulty, DIFFICULTIES } from '@/lib/minesweeper';
import { recordGame, loadStats } from '@/lib/storage';
import { Board, BOARD_GAP } from '@/components/game/Board';
import { GameHeader } from '@/components/game/GameHeader';
import { AICoach } from '@/components/game/AICoach';
import { StatsPanel } from '@/components/game/StatsPanel';
import { DifficultySelector } from '@/components/game/DifficultySelector';
import { Navbar } from '@/components/Navbar';

function calcCellSize(rows: number, cols: number): number {
  if (typeof window === 'undefined') return 30;
  const gap = BOARD_GAP;
  const maxW = Math.min(window.innerWidth - 48, 680);
  const maxH = window.innerHeight - 300;
  const byW = Math.floor((maxW - (cols-1)*gap) / cols);
  const byH = Math.floor((maxH - (rows-1)*gap) / rows);
  return Math.max(16, Math.min(36, byW, byH));
}

export default function GamePage() {
  const [isDark, setIsDark] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [cellSize, setCellSize] = useState(30);
  const [showAI, setShowAI] = useState(false);
  const [hinted, setHinted] = useState<[number,number]|null>(null);
  const [appStats, setAppStats] = useState(()=>loadStats());
  const [saved, setSaved] = useState(false);
  const [overlay, setOverlay] = useState<'won'|'lost'|null>(null);

  const game = useGame(difficulty);
  const { elapsed, display } = useTimer(game.status, game.startTime, game.endTime);
  const probMap = analyzeBoard(game.board);

  const config = DIFFICULTIES[difficulty];
  const boardW = config.cols*cellSize + (config.cols-1)*BOARD_GAP + 8;

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    setCellSize(calcCellSize(config.rows, config.cols));
  }, [difficulty]);

  useEffect(() => {
    const fn = () => setCellSize(calcCellSize(config.rows, config.cols));
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, [difficulty]);

  useEffect(() => {
    if ((game.status==='won'||game.status==='lost') && !saved) {
      setSaved(true);
      setAppStats(recordGame(difficulty, game.status==='won', elapsed));
      setTimeout(()=>setOverlay(game.status as 'won'|'lost'), 250);
    }
    if (game.status==='idle') { setSaved(false); setOverlay(null); }
  }, [game.status]);

  const toggle = () => { const n=!isDark; setIsDark(n); document.documentElement.classList.toggle('dark',n); localStorage.setItem('theme',n?'dark':'light'); };
  const handleDiff = (d: Difficulty) => { setDifficulty(d); game.reset(d); setHinted(null); setOverlay(null); setSaved(false); };
  const handleReset = useCallback(() => { game.reset(); setHinted(null); setOverlay(null); setSaved(false); }, [game]);

  const bg = isDark ? '#0a0514' : '#faf5ff';
  const isDark_ = isDark;

  return (
    <div style={{ background:bg, minHeight:'100vh' }}>
      <Navbar isDark={isDark_} onToggleTheme={toggle} />
      <main style={{ padding:'20px 16px', display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
        <DifficultySelector current={difficulty} onChange={handleDiff} isDark={isDark_} />

        <div style={{ display:'flex', gap:20, alignItems:'flex-start', flexWrap:'wrap', justifyContent:'center', width:'100%' }}>
          {/* Board */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
            <div className="animate-glow" style={{
              background: isDark_
                ? 'linear-gradient(145deg,#2e1065,#1e1b4b)'
                : 'linear-gradient(145deg,#7c3aed,#6d28d9)',
              padding:12, borderRadius:20,
              boxShadow: isDark_
                ? '0 20px 60px rgba(76,29,149,0.6)'
                : '0 20px 60px rgba(109,40,217,0.4)',
              position:'relative',
            }}>
              <div style={{ width:boardW }}>
                <GameHeader minesLeft={game.minesLeft} timerDisplay={display} status={game.status} onReset={handleReset} isDark={isDark_} />
              </div>
              <Board
                board={game.board} cellSize={cellSize}
                probMap={showAI?probMap:null} showAI={showAI}
                hintedCell={hinted} gameOver={game.status==='won'||game.status==='lost'}
                isDark={isDark_}
                onCellClick={game.handleClick}
                onCellRightClick={game.handleRightClick}
                onCellDoubleClick={game.handleChord}
              />
              {overlay&&(
                <div className="animate-fade-in" style={{
                  position:'absolute', inset:0, borderRadius:20,
                  background:'rgba(0,0,0,0.7)', backdropFilter:'blur(8px)',
                  display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12,
                }}>
                  <div className="animate-pop" style={{ fontSize:60 }}>{overlay==='won'?'🎉':'💥'}</div>
                  <div style={{ fontSize:26, fontWeight:900, color:'#fff' }}>{overlay==='won'?'You Won!':'Game Over'}</div>
                  {overlay==='won'&&<div style={{ color:'#c4b5fd', fontWeight:600 }}>Time: {display}s</div>}
                  <button onClick={handleReset} style={{ background:'linear-gradient(135deg,#8b5cf6,#ec4899)', color:'#fff', border:'none', borderRadius:12, padding:'12px 28px', fontSize:15, fontWeight:800, cursor:'pointer', boxShadow:'0 4px 16px rgba(139,92,246,0.5)', marginTop:4 }}>Play Again ✨</button>
                </div>
              )}
            </div>
            <div style={{ marginTop:8, fontSize:12, color:isDark_?'#6d28d9':'#94a3b8', textAlign:'center' }}>
              Right-click / long-press to flag • Double-click to chord
            </div>
          </div>

          {/* Side */}
          <div style={{ display:'flex', flexDirection:'column', gap:12, width:'100%', maxWidth:300 }}>
            <AICoach probMap={game.status==='playing'?probMap:null} showAI={showAI} onToggle={()=>{setShowAI(v=>!v);setHinted(null);}} onHint={setHinted} isDark={isDark_} gameActive={game.status==='playing'} />
            <StatsPanel stats={appStats} difficulty={difficulty} isDark={isDark_} />
          </div>
        </div>
      </main>
    </div>
  );
}
