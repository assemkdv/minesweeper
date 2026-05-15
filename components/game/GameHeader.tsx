'use client';
import { GameStatus } from '@/lib/minesweeper';
import { CatMascot, CatMood } from '@/components/CatMascot';

function moodFrom(status: GameStatus): CatMood {
  if (status === 'won')     return 'won';
  if (status === 'lost')    return 'lost';
  if (status === 'playing') return 'playing';
  return 'idle';
}

export function GameHeader({ minesLeft, timerDisplay, status, onReset, isDark }: {
  minesLeft: number; timerDisplay: string; status: GameStatus; onReset: () => void; isDark: boolean;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'var(--card)', border: '1px solid var(--border)',
      borderRadius: 12, padding: '8px 12px', marginBottom: 8,
    }}>
      <LCD value={String(Math.max(-99, Math.min(999, minesLeft))).padStart(3, '0')}/>
      <button
        onClick={onReset}
        title="New game"
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 4,
          borderRadius: '50%', transition: 'transform 0.15s',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.12)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
        onMouseDown={e  => (e.currentTarget as HTMLElement).style.transform = 'scale(0.9)'}
        onMouseUp={e    => (e.currentTarget as HTMLElement).style.transform = 'scale(1.12)'}>
        <CatMascot mood={moodFrom(status)} size={44}/>
      </button>
      <LCD value={timerDisplay}/>
    </div>
  );
}

function LCD({ value }: { value: string }) {
  return (
    <div style={{
      background: '#0d0408', color: '#ff85a1',
      fontFamily: '"Courier New", monospace', fontSize: 22, fontWeight: 900,
      padding: '4px 10px', letterSpacing: 4, borderRadius: 8,
      minWidth: 70, textAlign: 'right',
      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6)',
      border: '1px solid #2a0d1a',
    }}>{value}</div>
  );
}
