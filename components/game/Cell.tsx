'use client';
import { memo, useCallback, useState } from 'react';
import { Cell as CellType } from '@/lib/minesweeper';

const NUM_COLORS: Record<number, string> = {
  1: '#60a5fa', 2: '#34d399', 3: '#f87171',
  4: '#a78bfa', 5: '#fbbf24', 6: '#22d3ee',
  7: '#f472b6', 8: '#94a3b8',
};

interface Props {
  cell: CellType; cellSize: number; probability?: number;
  showAI: boolean; isHinted: boolean; isDark: boolean;
  onClick: (r: number, c: number) => void;
  onRightClick: (r: number, c: number) => void;
  onDoubleClick: (r: number, c: number) => void;
}

export const GameCell = memo(function GameCell({ cell, cellSize, probability, showAI, isHinted, isDark, onClick, onRightClick, onDoubleClick }: Props) {
  const { row, col, state, isMine, adjacentMines, exploded, wrongFlag } = cell;
  const [pressed, setPressed] = useState(false);

  const handleClick = useCallback((e: React.MouseEvent) => { e.preventDefault(); onClick(row, col); }, [onClick, row, col]);
  const handleCtx = useCallback((e: React.MouseEvent) => { e.preventDefault(); onRightClick(row, col); }, [onRightClick, row, col]);
  const handleDbl = useCallback((e: React.MouseEvent) => { e.preventDefault(); onDoubleClick(row, col); }, [onDoubleClick, row, col]);

  const sz = cellSize;
  const emojiSz = sz <= 22 ? 11 : sz <= 28 ? 14 : sz <= 34 ? 17 : 20;
  const numSz = sz <= 22 ? 10 : sz <= 28 ? 12 : sz <= 34 ? 14 : 16;

  const base: React.CSSProperties = {
    width: sz, height: sz, flexShrink: 0, borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    userSelect: 'none', boxSizing: 'border-box', position: 'relative',
    transition: 'transform 0.08s, box-shadow 0.08s',
    transform: pressed ? 'scale(0.88)' : 'scale(1)',
    cursor: state === 'revealed' && !isMine ? 'default' : 'pointer',
  };

  if (state === 'hidden') {
    const probColor = showAI && probability !== undefined && probability >= 0
      ? `hsla(${Math.round(120 - probability * 120)},80%,55%,0.65)` : null;
    return (
      <div style={{
        ...base,
        background: isDark
          ? 'linear-gradient(145deg,#6d28d9,#4c1d95)'
          : 'linear-gradient(145deg,#c4b5fd,#8b5cf6)',
        boxShadow: isDark
          ? '0 4px 10px rgba(76,29,149,0.6),inset 0 1px 0 rgba(255,255,255,0.08)'
          : '0 4px 10px rgba(124,58,237,0.3),inset 0 1px 0 rgba(255,255,255,0.5)',
      }}
        onClick={handleClick} onContextMenu={handleCtx} onDoubleClick={handleDbl}
        onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)}
        role="button" tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter'||e.key === ' ') handleClick(e as unknown as React.MouseEvent); if (e.key==='f') handleCtx(e as unknown as React.MouseEvent); }}
      >
        {probColor && (
          <div style={{ position:'absolute',inset:0,borderRadius:8,background:probColor,display:'flex',alignItems:'center',justifyContent:'center' }}>
            <span style={{ fontSize:9,fontWeight:800,color:'#fff',textShadow:'0 1px 3px rgba(0,0,0,0.8)' }}>{Math.round((probability!)*100)}%</span>
          </div>
        )}
        {isHinted && !probColor && (
          <div style={{ position:'absolute',inset:0,borderRadius:8,background:'rgba(99,102,241,0.7)',display:'flex',alignItems:'center',justifyContent:'center' }}>
            <span style={{ fontSize:emojiSz }}>⭐</span>
          </div>
        )}
      </div>
    );
  }

  if (state === 'flagged') {
    return (
      <div style={{
        ...base,
        background: isDark ? 'linear-gradient(145deg,#6d28d9,#4c1d95)' : 'linear-gradient(145deg,#c4b5fd,#8b5cf6)',
        boxShadow: isDark ? '0 4px 10px rgba(76,29,149,0.6)' : '0 4px 10px rgba(124,58,237,0.3)',
      }}
        onClick={handleClick} onContextMenu={handleCtx} onDoubleClick={handleDbl}
        onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)}
        role="button" tabIndex={0}
      >
        <span style={{ fontSize:emojiSz }}>{wrongFlag ? '❌' : '🚩'}</span>
      </div>
    );
  }

  // revealed
  if (isMine) {
    return (
      <div style={{
        ...base, cursor:'default',
        background: exploded ? 'linear-gradient(145deg,#ef4444,#dc2626)' : (isDark ? '#3b0a0a' : '#fee2e2'),
        boxShadow: exploded ? '0 0 20px rgba(239,68,68,0.9),0 0 40px rgba(239,68,68,0.4)' : 'none',
        borderRadius: 8,
        animation: exploded ? 'pop 0.3s ease-out' : undefined,
      }}>
        <span style={{ fontSize:emojiSz }}>{exploded ? '💥' : '💣'}</span>
      </div>
    );
  }

  return (
    <div style={{
      ...base, cursor:'default',
      background: isDark ? 'rgba(30,27,75,0.7)' : 'rgba(245,243,255,0.9)',
      border: `1px solid ${isDark ? 'rgba(109,40,217,0.3)' : 'rgba(196,181,253,0.5)'}`,
      boxShadow: 'none',
    }}>
      {adjacentMines > 0 && (
        <span style={{ fontSize:numSz, fontWeight:900, color: NUM_COLORS[adjacentMines] ?? '#94a3b8', lineHeight:1 }}>
          {adjacentMines}
        </span>
      )}
    </div>
  );
});
