'use client';
import { useState, useCallback } from 'react';
import { Cell, GameConfig, GameStatus, DIFFICULTIES, Difficulty, SeededRandom, createBoard, placeMines, revealCell, chordReveal, toggleFlag, isWon, revealAllMines } from '@/lib/minesweeper';
interface GameState { board: Cell[][]; status: GameStatus; minesLeft: number; config: GameConfig; isFirstClick: boolean; startTime: number | null; endTime: number | null; }
export function useGame(initialDifficulty: Difficulty = 'beginner', seed?: number) {
  const [state, setState] = useState<GameState>(() => {
    const config = DIFFICULTIES[initialDifficulty];
    return { board: createBoard(config.rows, config.cols), status: 'idle', minesLeft: config.mines, config, isFirstClick: true, startTime: null, endTime: null };
  });
  const reset = useCallback((newDifficulty?: Difficulty) => {
    setState(prev => {
      const config = newDifficulty ? DIFFICULTIES[newDifficulty] : prev.config;
      return { board: createBoard(config.rows, config.cols), status: 'idle', minesLeft: config.mines, config, isFirstClick: true, startTime: null, endTime: null };
    });
  }, []);
  const handleClick = useCallback((row: number, col: number) => {
    setState(prev => {
      if (prev.status === 'won' || prev.status === 'lost') return prev;
      if (prev.board[row][col].state === 'flagged' || prev.board[row][col].state === 'revealed') return prev;
      let board = prev.board, startTime = prev.startTime;
      let status: GameStatus = prev.status;
      if (prev.isFirstClick) {
        const rng = seed !== undefined ? new SeededRandom(seed) : undefined;
        board = placeMines(board, prev.config.mines, row, col, rng);
        startTime = Date.now(); status = 'playing';
      }
      board = revealCell(board, row, col);
      if (board[row][col].isMine) return { ...prev, board: revealAllMines(board, row, col), status: 'lost', startTime, endTime: Date.now(), isFirstClick: false };
      if (isWon(board)) return { ...prev, board, status: 'won', startTime, endTime: Date.now(), isFirstClick: false };
      return { ...prev, board, status, startTime, isFirstClick: false };
    });
  }, [seed]);
  const handleRightClick = useCallback((row: number, col: number) => {
    setState(prev => {
      if (prev.status === 'won' || prev.status === 'lost') return prev;
      if (prev.board[row][col].state === 'revealed') return prev;
      const board = toggleFlag(prev.board, row, col);
      const delta = board[row][col].state === 'flagged' ? -1 : 1;
      return { ...prev, board, minesLeft: prev.minesLeft + delta };
    });
  }, []);
  const handleChord = useCallback((row: number, col: number) => {
    setState(prev => {
      if (prev.status !== 'playing') return prev;
      const result = chordReveal(prev.board, row, col);
      if (!result) return prev;
      const { board, hitMine, mineRow, mineCol } = result;
      if (hitMine) return { ...prev, board: revealAllMines(board, mineRow, mineCol), status: 'lost', endTime: Date.now() };
      if (isWon(board)) return { ...prev, board, status: 'won', endTime: Date.now() };
      return { ...prev, board };
    });
  }, []);
  return { ...state, reset, handleClick, handleRightClick, handleChord };
}
