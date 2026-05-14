'use client';
import { useRef, useCallback, useEffect } from 'react';
import { Cell, ProbabilityMap } from '@/lib/minesweeper';
import { GameCell } from './Cell';

export const BOARD_GAP = 3;

interface Props {
  board: Cell[][]; cellSize: number;
  probMap: ProbabilityMap | null; showAI: boolean;
  hintedCell: [number,number] | null; gameOver: boolean; isDark: boolean;
  onCellClick: (r:number,c:number)=>void;
  onCellRightClick: (r:number,c:number)=>void;
  onCellDoubleClick: (r:number,c:number)=>void;
}

export function Board({ board, cellSize, probMap, showAI, hintedCell, gameOver, isDark, onCellClick, onCellRightClick, onCellDoubleClick }: Props) {
  const longRef = useRef<ReturnType<typeof setTimeout>|null>(null);
  const startRef = useRef<[number,number]|null>(null);
  const movedRef = useRef(false);

  const tStart = useCallback((r:number,c:number) => {
    startRef.current=[r,c]; movedRef.current=false;
    longRef.current = setTimeout(() => { if(!movedRef.current){onCellRightClick(r,c);startRef.current=null;} },450);
  },[onCellRightClick]);
  const tEnd = useCallback((r:number,c:number) => {
    if(longRef.current){clearTimeout(longRef.current);longRef.current=null;}
    if(startRef.current&&!movedRef.current) onCellClick(r,c);
    startRef.current=null;
  },[onCellClick]);
  const tMove = useCallback(()=>{ movedRef.current=true; if(longRef.current){clearTimeout(longRef.current);longRef.current=null;} },[]);
  useEffect(()=>()=>{if(longRef.current)clearTimeout(longRef.current);},[]);

  const cols = board[0]?.length ?? 0;
  return (
    <div style={{ display:'grid', gridTemplateColumns:`repeat(${cols},${cellSize}px)`, gap:`${BOARD_GAP}px`, padding:4, touchAction:'none' }}
      onContextMenu={e=>e.preventDefault()}>
      {board.map(row=>row.map(cell=>{
        const key=`${cell.row},${cell.col}`;
        return (
          <div key={key} onTouchStart={()=>tStart(cell.row,cell.col)} onTouchEnd={()=>tEnd(cell.row,cell.col)} onTouchMove={tMove}>
            <GameCell
              cell={cell} cellSize={cellSize}
              probability={probMap?.probs.get(key)}
              showAI={showAI&&!gameOver}
              isHinted={hintedCell?.[0]===cell.row&&hintedCell?.[1]===cell.col&&!gameOver}
              isDark={isDark}
              onClick={onCellClick} onRightClick={onCellRightClick} onDoubleClick={onCellDoubleClick}
            />
          </div>
        );
      }))}
    </div>
  );
}
