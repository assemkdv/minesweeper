'use client';
import { useState, useEffect } from 'react';
import { useGame } from '@/hooks/useGame';
import { useTimer } from '@/hooks/useTimer';
import { getDailySeed, analyzeBoard, DIFFICULTIES } from '@/lib/minesweeper';
import { recordDaily, loadStats, formatTime, todayAlreadyPlayed } from '@/lib/storage';
import { Board, BOARD_GAP } from '@/components/game/Board';
import { GameHeader } from '@/components/game/GameHeader';
import { AICoach } from '@/components/game/AICoach';
import { Navbar } from '@/components/Navbar';
import { CatMascot } from '@/components/CatMascot';

const CFG = DIFFICULTIES.intermediate;
function cd(): string {
  const now = new Date(), m = new Date();
  m.setUTCHours(24, 0, 0, 0);
  const s = Math.max(0, Math.floor((m.getTime() - now.getTime()) / 1000));
  return `${String(Math.floor(s/3600)).padStart(2,'0')}:${String(Math.floor((s%3600)/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
}

function FlameIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2c0 3-4 4-4 7a4 4 0 008 0c0-3-4-4-4-7z" fill="#ff4d6d"/>
      <path d="M8 8c0 1.5-1.5 2-1.5 3a1.5 1.5 0 003 0c0-1-1.5-1.5-1.5-3z" fill="#ffc2d1"/>
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="#ff85a1" strokeWidth="1.5"/>
      <ellipse cx="7" cy="7" rx="2.5" ry="5.5" stroke="#ff85a1" strokeWidth="1.5"/>
      <line x1="1.5" y1="7" x2="12.5" y2="7" stroke="#ff85a1" strokeWidth="1.5"/>
    </svg>
  );
}

export default function DailyPage() {
  const [isDark, setIsDark]       = useState(false);
  const [seed]                    = useState(() => getDailySeed());
  const [showAI, setShowAI]       = useState(false);
  const [hinted, setHinted]       = useState<[number,number]|null>(null);
  const [usedHints, setUsedHints] = useState(false);
  const [saved, setSaved]         = useState(false);
  const [countdown, setCd]        = useState(cd);
  const [sz, setSz]               = useState(26);
  const [appStats, setAppStats]   = useState(() => loadStats());
  const [overlay, setOverlay]     = useState<'won'|'lost'|null>(null);
  const [alreadyPlayed, setAlreadyPlayed] = useState<{ result: 'won'|'lost'|null; timeMs: number|null; usedHints: boolean|null } | null>(null);

  const game = useGame('intermediate', seed);
  const { elapsed, display } = useTimer(game.status, game.startTime, game.endTime);
  const probMap = analyzeBoard(game.board);

  useEffect(() => {
    const s = localStorage.getItem('theme');
    const dark = s === 'dark';
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
    const calc = () => setSz(Math.max(16, Math.min(28, Math.floor((Math.min(window.innerWidth-48,560)-(CFG.cols-1)*BOARD_GAP)/CFG.cols))));
    calc();
    window.addEventListener('resize', calc);

    const prev = todayAlreadyPlayed();
    if (prev.played) setAlreadyPlayed(prev);

    return () => window.removeEventListener('resize', calc);
  }, []);
  useEffect(() => { const t = setInterval(() => setCd(cd()), 1000); return () => clearInterval(t); }, []);
  useEffect(() => {
    if ((game.status === 'won' || game.status === 'lost') && !saved) {
      setSaved(true);
      const stats = recordDaily(game.status === 'won', elapsed, usedHints);
      setAppStats(stats);
      setAlreadyPlayed({ result: game.status, timeMs: elapsed, usedHints });
      setTimeout(() => setOverlay(game.status as 'won'|'lost'), 250);
    }
  }, [game.status]);

  const toggle = () => { const n=!isDark; setIsDark(n); document.documentElement.classList.toggle('dark',n); localStorage.setItem('theme',n?'dark':'light'); };
  const handleToggleAI = () => { setShowAI(v => !v); setHinted(null); setUsedHints(true); };
  const handleHint = (cell: [number,number]) => { setHinted(cell); setUsedHints(true); };

  const boardW = CFG.cols * sz + (CFG.cols - 1) * BOARD_GAP + 8;

  if (alreadyPlayed && !overlay) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        <Navbar isDark={isDark} onToggleTheme={toggle}/>
        <main style={{ padding: '40px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 16, padding: '18px 24px', textAlign: 'center', maxWidth: 460, width: '100%',
          }}>
            <h1 style={{ fontWeight: 900, fontSize: 22, color: 'var(--text)', marginBottom: 4 }}>Daily Challenge</h1>
            <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 4 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, color: 'var(--muted)', fontSize: 12, marginBottom: 6 }}>
              <GlobeIcon/> Same board for everyone today
            </div>
            <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700 }}>Next puzzle in {countdown}</div>
          </div>

          <div style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 20, padding: '40px 32px', maxWidth: 400, width: '100%',
            textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
          }}>
            <CatMascot mood={alreadyPlayed.result === 'won' ? 'won' : 'lost'} size={96}/>
            <div style={{ fontWeight: 900, fontSize: 22, color: 'var(--text)' }}>
              {alreadyPlayed.result === 'won' ? "You already won today!" : "Already played today"}
            </div>
            {alreadyPlayed.result === 'won' && alreadyPlayed.timeMs && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--btn)' }}>{formatTime(alreadyPlayed.timeMs)}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FlameIcon/>
                  <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>{appStats.dailyStreak}-day streak</span>
                </div>
                {alreadyPlayed.usedHints === false && (
                  <div style={{
                    background: 'rgba(201,24,74,0.08)', border: '1px solid rgba(201,24,74,0.2)',
                    borderRadius: 20, padding: '4px 12px',
                    fontSize: 12, color: 'var(--btn)', fontWeight: 700,
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    No hints used
                  </div>
                )}
              </div>
            )}
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>Come back tomorrow for a new puzzle</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--btn)' }}>Next puzzle in {countdown}</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar isDark={isDark} onToggleTheme={toggle}/>
      <main style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>

        <div style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: 16, padding: '18px 24px', textAlign: 'center', maxWidth: 460, width: '100%',
        }}>
          <h1 style={{ fontWeight: 900, fontSize: 22, color: 'var(--text)', marginBottom: 4 }}>Daily Challenge</h1>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 4 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, color: 'var(--muted)', fontSize: 12, marginBottom: 6 }}>
            <GlobeIcon/> Same board for everyone today
          </div>
          <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700 }}>Next puzzle in {countdown}</div>
        </div>

        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 16, padding: 12,
              boxShadow: '0 8px 32px rgba(255,133,161,0.15)',
              position: 'relative',
            }}>
              <div style={{ width: boardW }}>
                <GameHeader minesLeft={game.minesLeft} timerDisplay={display} status={game.status} onReset={() => {}} isDark={isDark}/>
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
                  background: 'rgba(61,21,32,0.80)', backdropFilter: 'blur(8px)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', gap: 12, padding: 24,
                }}>
                  <div className="anim-pop"><CatMascot mood={overlay === 'won' ? 'won' : 'lost'} size={80}/></div>
                  {overlay === 'won' ? (
                    <>
                      <div style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>Daily complete!</div>
                      <div style={{ color: '#ffc2d1', fontWeight: 700, fontSize: 18 }}>{display}</div>
                      <div style={{ color: '#ffc2d1', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <FlameIcon/> {appStats.dailyStreak}-day streak
                      </div>
                      {!usedHints && (
                        <div style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 20, padding: '4px 12px', fontSize: 12, color: '#fff', fontWeight: 700 }}>No hints used</div>
                      )}
                      <div style={{ color: 'rgba(255,194,209,0.7)', fontSize: 12, marginTop: 4 }}>Come back tomorrow for a new puzzle</div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>Better luck tomorrow!</div>
                      <div style={{ color: 'rgba(255,194,209,0.8)', fontSize: 13 }}>Next puzzle in {countdown}</div>
                    </>
                  )}
                </div>
              )}
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>Long-press to flag on mobile</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 280, width: '100%' }}>
            <AICoach
              probMap={game.status === 'playing' ? probMap : null}
              showAI={showAI}
              onToggle={handleToggleAI}
              onHint={handleHint}
              isDark={isDark}
              gameActive={game.status === 'playing'}
            />
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '12px 14px' }}>
              <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 14, marginBottom: 10 }}>Daily Stats</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {[
                  { l: 'Streak', v: <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>{appStats.dailyStreak} <FlameIcon/></span> },
                  { l: 'Best',   v: appStats.dailyBestTime ? formatTime(appStats.dailyBestTime) : '—' },
                ].map(({ l, v }) => (
                  <div key={l} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '7px 10px' }}>
                    <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{l}</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--accent)', marginTop: 2 }}>{v}</div>
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
