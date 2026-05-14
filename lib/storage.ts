export interface DifficultyStats {
  gamesPlayed: number;
  wins: number;
  bestTime: number | null;
  currentStreak: number;
  bestStreak: number;
  totalTime: number;
}
export interface AppStats {
  beginner: DifficultyStats;
  intermediate: DifficultyStats;
  expert: DifficultyStats;
  dailyStreak: number;
  lastDailyDate: string | null;
  dailyBestTime: number | null;
}
const DEFAULT: DifficultyStats = { gamesPlayed: 0, wins: 0, bestTime: null, currentStreak: 0, bestStreak: 0, totalTime: 0 };
const DEFAULT_STATS: AppStats = { beginner: {...DEFAULT}, intermediate: {...DEFAULT}, expert: {...DEFAULT}, dailyStreak: 0, lastDailyDate: null, dailyBestTime: null };
const KEY = 'msp_stats_v1';
export function loadStats(): AppStats {
  if (typeof window === 'undefined') return DEFAULT_STATS;
  try { const raw = localStorage.getItem(KEY); return raw ? { ...DEFAULT_STATS, ...JSON.parse(raw) } : DEFAULT_STATS; } catch { return DEFAULT_STATS; }
}
export function saveStats(s: AppStats): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(s));
}
export function recordGame(difficulty: 'beginner'|'intermediate'|'expert', won: boolean, timeMs: number): AppStats {
  const s = loadStats();
  const d = s[difficulty];
  d.gamesPlayed++; d.totalTime += timeMs;
  if (won) { d.wins++; d.currentStreak++; d.bestStreak = Math.max(d.bestStreak, d.currentStreak); if (d.bestTime === null || timeMs < d.bestTime) d.bestTime = timeMs; }
  else d.currentStreak = 0;
  saveStats(s); return s;
}
export function recordDaily(won: boolean, timeMs: number): AppStats {
  const s = loadStats();
  const today = new Date().toISOString().split('T')[0];
  if (won) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (s.lastDailyDate === yesterday) s.dailyStreak++;
    else if (s.lastDailyDate !== today) s.dailyStreak = 1;
    s.lastDailyDate = today;
    if (s.dailyBestTime === null || timeMs < s.dailyBestTime) s.dailyBestTime = timeMs;
  }
  saveStats(s); return s;
}
export function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000), m = Math.floor(s / 60), sec = s % 60, msec = Math.floor((ms % 1000) / 10);
  return m > 0 ? `${m}:${String(sec).padStart(2,'0')}.${String(msec).padStart(2,'0')}` : `${sec}.${String(msec).padStart(2,'0')}s`;
}
export function getWinRate(s: DifficultyStats): number {
  return s.gamesPlayed === 0 ? 0 : Math.round((s.wins / s.gamesPlayed) * 100);
}
