'use client';
import { memo, useCallback, useState } from 'react';
import { Cell as CellType } from '@/lib/minesweeper';

const NUM: Record<number, string> = {
  1: '#3b82f6', 2: '#16a34a', 3: '#dc2626',
  4: '#7c3aed', 5: '#ea580c', 6: '#0891b2',
  7: '#db2777', 8: '#78716c',
};

interface Props {
  cell: CellType; cellSize: number; probability?: number;
  showAI: boolean; isHinted: boolean; isDark: boolean;
  onClick: (r: number, c: number) => void;
  onRightClick: (r: number, c: number) => void;
  onDoubleClick: (r: number, c: number) => void;
}

export const GameCell = memo(function GameCell({
  cell, cellSize, probability, showAI, isHinted, isDark,
  onClick, onRightClick, onDoubleClick,
}: Props) {
  const { row, col, state, isMine, adjacentMines, exploded, wrongFlag } = cell;
  const [pressed, setPressed] = useState(false);

  const click  = useCallback((e: React.MouseEvent) => { e.preventDefault(); onClick(row, col); },      [onClick, row, col]);
  const rclick = useCallback((e: React.MouseEvent) => { e.preventDefault(); onRightClick(row, col); }, [onRightClick, row, col]);
  const dbl    = useCallback((e: React.MouseEvent) => { e.preventDefault(); onDoubleClick(row, col); },[onDoubleClick, row, col]);

  const sz   = cellSize;
  const esz  = sz <= 22 ? 11 : sz <= 28 ? 14 : sz <= 34 ? 17 : 20;
  const nsz  = sz <= 22 ? 10 : sz <= 28 ? 12 : sz <= 34 ? 14 : 16;

  const base: React.CSSProperties = {
    width: sz, height: sz, flexShrink: 0, borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    userSelect: 'none', boxSizing: 'border-box', position: 'relative',
    transition: 'transform 0.08s ease',
    transform: pressed ? 'scale(0.86)' : 'scale(1)',
    cursor: 'pointer',
  };

  /* ── HIDDEN ── */
  if (state === 'hidden') {
    const showProb = showAI && probability !== undefined && probability >= 0;
    const hue = showProb ? Math.round(120 - probability! * 120) : null;
    return (
      <div style={{
        ...base,
        background: isDark
          ? 'linear-gradient(145deg,#1e3a30,#152b22)'
          : 'linear-gradient(145deg,#c8e6c9,#a5d6a7)',
        boxShadow: isDark
          ? '0 3px 7px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)'
          : '0 3px 7px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.70)',
      }}
        onClick={click} onContextMenu={rclick} onDoubleClick={dbl}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        role="button" tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') click(e as unknown as React.MouseEvent);
          if (e.key === 'f' || e.key === 'F') rclick(e as unknown as React.MouseEvent);
        }}
      >
        {hue !== null && (
          <div style={{ position:'absolute', inset:0, borderRadius:8, background:`hsla(${hue},75%,50%,0.6)`,
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontSize:9, fontWeight:800, color:'#fff', textShadow:'0 1px 3px rgba(0,0,0,0.7)' }}>
              {Math.round(probability! * 100)}%
            </span>
          </div>
        )}
        {isHinted && hue === null && (
          <div style={{ position:'absolute', inset:0, borderRadius:8, background:'rgba(234,179,8,0.55)',
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontSize: esz }}>⭐</span>
          </div>
        )}
      </div>
    );
  }

  /* ── FLAGGED ── */
  if (state === 'flagged') {
    return (
      <div style={{
        ...base,
        background: isDark ? '#3d1a14' : '#fde8e4',
        boxShadow: isDark ? '0 3px 7px rgba(0,0,0,0.4)' : '0 3px 7px rgba(0,0,0,0.08)',
        border: `1px solid ${isDark ? '#6b2116' : '#f9c4ba'}`,
      }}
        onClick={click} onContextMenu={rclick}
        onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)}
        role="button" tabIndex={0}
      >
        <span style={{ fontSize: esz }}>{wrongFlag ? '❌' : '🚩'}</span>
      </div>
    );
  }

  /* ── REVEALED – mine ── */
  if (isMine) {
    return (
      <div style={{
        ...base, cursor: 'default',
        background: exploded ? '#ef4444' : (isDark ? '#2a1010' : '#fecaca'),
        boxShadow: exploded ? '0 0 18px rgba(239,68,68,0.7)' : 'none',
        animation: exploded ? 'pop 0.3s ease-out' : undefined,
      }}>
        <span style={{ fontSize: esz }}>{exploded ? '💥' : '💣'}</span>
      </div>
    );
  }

  /* ── REVEALED – safe ── */
  return (
    <div style={{
      ...base, cursor: 'default',
      background: isDark ? '#1a1a1a' : '#f5f0e8',
      border: `1px solid ${isDark ? '#2a2a2a' : '#e5ddd5'}`,
      boxShadow: 'none',
    }}>
      {adjacentMines > 0 && (
        <span style={{ fontSize: nsz, fontWeight: 900, color: NUM[adjacentMines] ?? '#78716c', lineHeight: 1 }}>
          {adjacentMines}
        </span>
      )}
    </div>
  );
});
