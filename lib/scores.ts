import { supabase } from './supabase';

export interface ScoreRow {
  id: string;
  username: string;
  difficulty: string;
  time_ms: number;
  no_hints: boolean;
  created_at: string;
}

export async function submitScore(params: {
  username: string;
  difficulty: 'beginner' | 'intermediate' | 'expert' | 'daily';
  timeMs: number;
  noHints: boolean;
}) {
  const { error } = await supabase.from('scores').insert({
    username: params.username,
    difficulty: params.difficulty,
    time_ms: params.timeMs,
    no_hints: params.noHints,
  });
  return error;
}

export async function fetchTopScores(difficulty: string, limit = 20): Promise<ScoreRow[]> {
  const { data, error } = await supabase
    .from('scores')
    .select('*')
    .eq('difficulty', difficulty)
    .order('time_ms', { ascending: true })
    .limit(limit);
  if (error || !data) return [];
  return data as ScoreRow[];
}

export function getOrCreateGuestName(): string {
  const key = 'mineko_guest_name';
  const stored = localStorage.getItem(key);
  if (stored) return stored;
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
  const name = `Guest_${suffix}`;
  localStorage.setItem(key, name);
  return name;
}
