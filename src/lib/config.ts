import type { Difficulty, CreatureKind } from '@/types';

export const CONFIG = {
  durationMs: 60000, // 60초
  spawn: {
    easy: { intervalMs: [900, 1100], maxAlive: 5 },
    medium: { intervalMs: [650, 850], maxAlive: 7 },
    hard: { intervalMs: [450, 600], maxAlive: 9 },
  },
  speedPxPerSec: {
    easy: [120, 180],
    medium: [200, 260],
    hard: [280, 360],
  },
  // 확률 합 = 100
  weights: {
    easy: { common: 70, malaria: 20, bee: 10 },
    medium: { common: 65, malaria: 25, bee: 10 },
    hard: { common: 60, malaria: 28, bee: 12 },
  },
  scores: { common: 1, malaria: 3, bee: -5 },
  hitbox: { radiusPx: 22 }, // 기기별 비율 적용 가능
} as const;

export function getSpawnInterval(difficulty: Difficulty): number {
  const [min, max] = CONFIG.spawn[difficulty].intervalMs;
  return min + Math.random() * (max - min);
}

export function getSpeed(difficulty: Difficulty): number {
  const [min, max] = CONFIG.speedPxPerSec[difficulty];
  return min + Math.random() * (max - min);
}

export function getMaxAlive(difficulty: Difficulty): number {
  return CONFIG.spawn[difficulty].maxAlive;
}

