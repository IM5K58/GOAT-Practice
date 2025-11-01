export type Difficulty = 'easy' | 'medium' | 'hard';
export type CreatureKind = 'common' | 'malaria' | 'bee';

export interface PlaySession {
  name: string;
  difficulty: Difficulty;
  score: number;
  startedAt?: number;
  endedAt?: number;
}

export interface Creature {
  id: string;
  kind: CreatureKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hit: boolean;
}

export interface RecordRequest {
  name: string;
  difficulty: Difficulty;
  score: number;
  durationMs: number;
  avgCatchMs: number;
  caught: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  durationMs: number;
  avgCatchMs: number;
  caught: number;
  createdAt: number;
}

