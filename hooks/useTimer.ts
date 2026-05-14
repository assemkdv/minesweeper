'use client';
import { useState, useEffect, useRef } from 'react';
import { GameStatus } from '@/lib/minesweeper';
export function useTimer(status: GameStatus, startTime: number | null, endTime: number | null) {
  const [elapsed, setElapsed] = useState(0);
  const rafRef = useRef<number | null>(null);
  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (status === 'playing' && startTime !== null) {
      const tick = () => { setElapsed(Date.now() - startTime); rafRef.current = requestAnimationFrame(tick); };
      rafRef.current = requestAnimationFrame(tick);
      return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    }
    if ((status === 'won' || status === 'lost') && startTime && endTime) setElapsed(endTime - startTime);
    else if (status === 'idle') setElapsed(0);
  }, [status, startTime, endTime]);
  const display = String(Math.min(Math.floor(elapsed / 1000), 999)).padStart(3, '0');
  return { elapsed, display };
}
