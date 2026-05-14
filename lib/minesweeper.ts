export type CellState = 'hidden' | 'revealed' | 'flagged';
export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

export interface Cell {
  isMine: boolean;
  state: CellState;
  adjacentMines: number;
  row: number;
  col: number;
  exploded?: boolean;
  wrongFlag?: boolean;
}

export interface GameConfig {
  rows: number;
  cols: number;
  mines: number;
  label: string;
}

export const DIFFICULTIES = {
  beginner:     { rows: 9,  cols: 9,  mines: 10, label: 'Beginner' },
  intermediate: { rows: 16, cols: 16, mines: 40, label: 'Intermediate' },
  expert:       { rows: 16, cols: 30, mines: 99, label: 'Expert' },
} as const;

export type Difficulty = keyof typeof DIFFICULTIES;

export class SeededRandom {
  private s: number;
  constructor(seed: number) { this.s = seed >>> 0; }
  next(): number {
    let t = (this.s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}

export function getDailySeed(date: Date = new Date()): number {
  const y = date.getUTCFullYear(), m = date.getUTCMonth() + 1, d = date.getUTCDate();
  return ((y * 10000 + m * 100 + d) * 1337 + 42) >>> 0;
}

export function createBoard(rows: number, cols: number): Cell[][] {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({ isMine: false, state: 'hidden' as CellState, adjacentMines: 0, row: r, col: c }))
  );
}

function getNeighbors(board: Cell[][], r: number, c: number): Cell[] {
  const result: Cell[] = [];
  for (let dr = -1; dr <= 1; dr++)
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < board.length && nc >= 0 && nc < board[0].length) result.push(board[nr][nc]);
    }
  return result;
}

export function placeMines(board: Cell[][], mines: number, safeR: number, safeC: number, rng?: SeededRandom): Cell[][] {
  const b = board.map(row => row.map(c => ({ ...c })));
  const rows = b.length, cols = b[0].length;
  const safe = new Set<string>();
  for (let dr = -1; dr <= 1; dr++)
    for (let dc = -1; dc <= 1; dc++) safe.add(`${safeR + dr},${safeC + dc}`);
  const pool: [number, number][] = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (!safe.has(`${r},${c}`)) pool.push([r, c]);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor((rng ? rng.next() : Math.random()) * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  for (let i = 0; i < Math.min(mines, pool.length); i++) b[pool[i][0]][pool[i][1]].isMine = true;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (!b[r][c].isMine) b[r][c].adjacentMines = getNeighbors(b, r, c).filter(n => n.isMine).length;
  return b;
}

export function revealCell(board: Cell[][], row: number, col: number): Cell[][] {
  const b = board.map(r => r.map(c => ({ ...c })));
  if (b[row][col].state !== 'hidden') return b;
  const queue: [number, number][] = [[row, col]];
  const seen = new Set<string>();
  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    const key = `${r},${c}`;
    if (seen.has(key) || b[r][c].state !== 'hidden') continue;
    seen.add(key);
    b[r][c].state = 'revealed';
    if (!b[r][c].isMine && b[r][c].adjacentMines === 0) {
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < b.length && nc >= 0 && nc < b[0].length && b[nr][nc].state === 'hidden') queue.push([nr, nc]);
        }
    }
  }
  return b;
}

export function chordReveal(board: Cell[][], row: number, col: number): { board: Cell[][]; hitMine: boolean; mineRow: number; mineCol: number } | null {
  const cell = board[row][col];
  if (cell.state !== 'revealed' || cell.adjacentMines === 0) return null;
  const ns = getNeighbors(board, row, col);
  const flagged = ns.filter(n => n.state === 'flagged').length;
  if (flagged !== cell.adjacentMines) return null;
  let b = board.map(r => r.map(c => ({ ...c })));
  for (const n of ns) {
    if (n.state === 'hidden') {
      if (n.isMine) return { board: b, hitMine: true, mineRow: n.row, mineCol: n.col };
      b = revealCell(b, n.row, n.col);
    }
  }
  return { board: b, hitMine: false, mineRow: -1, mineCol: -1 };
}

export function toggleFlag(board: Cell[][], row: number, col: number): Cell[][] {
  const b = board.map(r => r.map(c => ({ ...c })));
  const s = b[row][col].state;
  if (s === 'hidden') b[row][col].state = 'flagged';
  else if (s === 'flagged') b[row][col].state = 'hidden';
  return b;
}

export function isWon(board: Cell[][]): boolean {
  return board.every(row => row.every(c => c.isMine ? c.state !== 'revealed' : c.state === 'revealed'));
}

export function revealAllMines(board: Cell[][], explodedR: number, explodedC: number): Cell[][] {
  return board.map(row => row.map(c => ({
    ...c,
    state: c.isMine ? 'revealed' as CellState : c.state,
    exploded: c.row === explodedR && c.col === explodedC,
    wrongFlag: c.state === 'flagged' && !c.isMine,
  })));
}

export interface ProbabilityMap {
  probs: Map<string, number>;
  safeCells: Array<[number, number]>;
  definiteMineCells: Array<[number, number]>;
  bestMove: [number, number] | null;
  bestMoveProbability: number;
}

export function analyzeBoard(board: Cell[][]): ProbabilityMap {
  const rows = board.length, cols = board[0].length;
  const probs = new Map<string, number>();
  const certain = new Map<string, boolean>();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = board[r][c];
      if (cell.state !== 'revealed' || cell.adjacentMines === 0) continue;
      const ns = getNeighbors(board, r, c);
      const hidden = ns.filter(n => n.state === 'hidden');
      const flagged = ns.filter(n => n.state === 'flagged').length;
      const remaining = cell.adjacentMines - flagged;
      if (hidden.length === 0) continue;
      if (remaining <= 0) hidden.forEach(n => { if (!certain.has(`${n.row},${n.col}`)) certain.set(`${n.row},${n.col}`, false); });
      else if (remaining === hidden.length) hidden.forEach(n => certain.set(`${n.row},${n.col}`, true));
      else { const p = remaining / hidden.length; hidden.forEach(n => { const k = `${n.row},${n.col}`; if (!certain.has(k)) probs.set(k, Math.max(probs.get(k) ?? 0, p)); }); }
    }
  }
  certain.forEach((isMine, k) => probs.set(k, isMine ? 1 : 0));
  const safeCells: Array<[number, number]> = [], definiteMineCells: Array<[number, number]> = [];
  let bestMove: [number, number] | null = null, bestProb = Infinity;
  probs.forEach((p, k) => {
    const [r, c] = k.split(',').map(Number);
    if (p === 0) safeCells.push([r, c]);
    else if (p === 1) definiteMineCells.push([r, c]);
    if (p < bestProb) { bestProb = p; bestMove = [r, c]; }
  });
  return { probs, safeCells, definiteMineCells, bestMove, bestMoveProbability: Number.isFinite(bestProb) ? bestProb : 1 };
}
