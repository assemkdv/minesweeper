'use client';
import { useState, useEffect, useCallback } from 'react';
import { useGame } from '@/hooks/useGame';
import { useTimer } from '@/hooks/useTimer';
import { analyzeBoard, Difficulty, DIFFICULTIES } from '@/lib/minesweeper';
import { recordGame, loadStats } from '@/lib/storage';
import { submitScore, getOrCreateGuestName } from '@/lib/scores';
import { supabase } from '@/lib/supabase';
import { Board, BOARD_GAP } from '@/components/game/Board';
import { GameHeader } from '@/components/game/GameHeader';
import { AICoach } from '@/components/game/AICoach';
import { StatsPanel } from '@/components/game/StatsPanel';
import { DifficultySelector } from '@/components/game/DifficultySelector';
import { Navbar } from '@/components/Navbar';
import { CatMascot } from '@/components/CatMascot';

function calcSize(rows: number, cols: number): number {
  if (typeof window === 'undefined') return 30;
  const g = BOARD_GAP;
  const w = Math.min(window.innerWidth - 48, 680);
  const h = window.innerHeight - 300;
  return Math.max(16, Math.min(36, Math.floor((w - (cols-1)*g) / cols), Math.floor((h - (rows-1)*g) / rows)));
}

export default function GamePage() {
  const [isDark, setIsDark]     = useState(false);
  const [diff, setDiff]         = useState<Difficulty>('beginner');
  const [sz, setSz]             = useState(30);
  const [showAI, setShowAI]     = useState(false);
  const [hinted, setHinted]     = useState<[number,number]|null>(null);
  const [appStats, setAppStats] = useState(() => loadStats());
  const [saved, setSaved]       = useState(false);
  const [overlay, setOverlay]   = useState<'won'|'lost'|null>(null);
  const [username, setUsername] = useState<string | null>(null);

  const game = useGame(diff);
  const { elapsed, display } = useTimer(game.status, game.startTime, game.endTime);
  const probMap = analyzeBoard(game.board);
  const cfg = DIFFICULTIES[diff];
  const boardW = cfg.cols * sz + (cfg.cols - 1) * BOARD_GAP + 8;

  useEffect(() => {
    const s = localStorage.getItem('theme');
    const dark = s === 'dark';
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
    setSz(calcSize(cfg.rows, cfg.cols));
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) {
        setUsername(data.user.email.split('@')[0]);
      } else {
        setUsername(getOrCreateGuestName());
      }
    });
  }, [diff]);
  useEffect(() => {
    const fn = () => setSz(calcSize(cfg.rows, cfg.cols));
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, [diff]);
  useEffect(() => {
    if ((game.status === 'won' || game.status === 'lost') && !saved) {
      setSaved(true);
      setAppStats(recordGame(diff, game.status === 'won', elapsed));
      if (game.status === 'won' && username) {
        submitScore({ username, difficulty: diff, timeMs: elapsed, noHints: false });
      }
      setTimeout(() => setOverlay(game.status as 'won'|'lost'), 250);
    }
    if (game.status === 'idle') { setSaved(false); setOverlay(null); }
  }, [game.status]);

  const toggle = () => { const n=!isDark; setIsDark(n); document.documentElement.classList.toggle('dark',n); localStorage.setItem('theme',n?'dark':'light'); };
  const handleDiff = (d: Difficulty) => { setDiff(d); game.reset(d); setHinted(null); setOverlay(null); setSaved(false); };
  const handleReset = useCallback(() => { game.reset(); setHinted(null); setOverlay(null); setSaved(false); }, [game]);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar isDark={isDark} onToggleTheme={toggle}/>
      <main style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <DifficultySelector current={diff} onChange={handleDiff} isDark={isDark}/>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>

          {/* Board */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 16, padding: 12,
              boxShadow: '0 8px 32px rgba(255,133,161,0.15)',
              position: 'relative',
            }}>
              <div style={{ width: boardW }}>
                <GameHeader minesLeft={game.minesLeft} timerDisplay={display} status={game.status} onReset={handleReset} isDark={isDark}/>
              </div>
              <Board
                board={game.board} cellSize={sz}
                probMap={showAI ? probMap : null} showAI={showAI}
                hintedCell={hinted}
                gameOver={game.status === 'won' || game.status === 'lost'}
                isDark={isDark}
                onCellClick={game.handleClick}
                onCellRightClick={game.handleRightClick}
                onCellDoubleClick={game.handleChord}
              />

              {overlay && (
                <div className="anim-fadeup" style={{
                  position: 'absolute', inset: 0, borderRadius: 16,
                  background: 'rgba(61,21,32,0.75)', backdropFilter: 'blur(8px)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', gap: 12,
                }}>
                  <div className="anim-pop">
                    <CatMascot mood={overlay === 'won' ? 'won' : 'lost'} size={80}/>
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: '#fff' }}>
                    {overlay === 'won' ? 'You won, nya~!' : 'Boom! Try again!'}
                  </div>
                  {overlay === 'won' && <div style={{ color: '#ffc2d1', fontWeight: 600 }}>Time: {display}s</div>}
                  <button onClick={handleReset} style={{
                    background: 'var(--accent)', color: '#fff', border: 'none',
                    borderRadius: 10, padding: '11px 28px', fontSize: 15, fontWeight: 800,
                    cursor: 'pointer', boxShadow: '0 4px 14px rgba(255,77,109,0.4)', marginTop: 4,
                  }}>Play again</button>
                </div>
              )}
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
              Right-click or long-press to flag &bull; Double-click to chord
            </div>
          </div>

          {/* Side panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 280 }}>
            <AICoach
              probMap={game.status === 'playing' ? probMap : null}
              showAI={showAI}
              onToggle={() => { setShowAI(v=>!v); setHinted(null); }}
              onHint={setHinted}
              isDark={isDark}
              gameActive={game.status === 'playing'}
            />
            <StatsPanel stats={appStats} difficulty={diff} isDark={isDark}/>
          </div>
        </div>
      </main>
    </div>
  );
}
