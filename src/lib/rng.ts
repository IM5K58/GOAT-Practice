import type { Difficulty, CreatureKind } from '@/types';
import { CONFIG } from './config';

/**
 * 가중치 기반 랜덤 생물 종류 선택
 */
export function randomCreatureKind(difficulty: Difficulty): CreatureKind {
  const weights = CONFIG.weights[difficulty];
  const total = weights.common + weights.malaria + weights.bee;
  const rand = Math.random() * total;

  if (rand < weights.common) {
    return 'common';
  } else if (rand < weights.common + weights.malaria) {
    return 'malaria';
  } else {
    return 'bee';
  }
}

/**
 * 랜덤 각도 생성 (0 ~ 2π)
 */
export function randomAngle(): number {
  return Math.random() * Math.PI * 2;
}

/**
 * 두 점 사이의 거리 계산
 */
export function distance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

