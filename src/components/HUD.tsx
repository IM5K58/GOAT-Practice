'use client';

import type { Difficulty } from '@/types';

interface HUDProps {
  name: string;
  difficulty: Difficulty;
  timeLeft: number;
  score: number;
}

export default function HUD({ name, difficulty, timeLeft, score }: HUDProps) {
  const difficultyText =
    difficulty === 'easy'
      ? '쉬움'
      : difficulty === 'medium'
        ? '보통'
        : '어려움';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 space-y-2">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
        게임 정보
      </h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">이름:</span>
          <span className="font-medium text-gray-800 dark:text-white">
            {name}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">난이도:</span>
          <span className="font-medium text-gray-800 dark:text-white">
            {difficultyText}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">잔여 시간:</span>
          <span className="font-medium text-gray-800 dark:text-white">
            {Math.ceil(timeLeft / 1000)}초
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">점수:</span>
          <span
            className={`font-bold text-lg ${
              score >= 0
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {score}
          </span>
        </div>
      </div>
    </div>
  );
}

