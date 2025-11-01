'use client';

import { useEffect, useState } from 'react';
import type { LeaderboardEntry, Difficulty } from '@/types';
import { getLeaderboard } from '@/lib/api';

interface LeaderboardProps {
  difficulty: Difficulty;
  refreshKey?: number;
}

export default function Leaderboard({
  difficulty,
  refreshKey,
}: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getLeaderboard(difficulty);
        setEntries(data.top);
      } catch (err) {
        setError(err instanceof Error ? err.message : '랭킹을 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [difficulty, refreshKey]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
          랭킹 (TOP 5)
        </h3>
        <div className="text-center text-gray-500 dark:text-gray-400 py-4">
          로딩 중...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
          랭킹 (TOP 5)
        </h3>
        <div className="text-center text-red-500 text-sm py-4">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
        랭킹 (TOP 5)
      </h3>
      {entries.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-4">
          아직 기록이 없습니다.
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div
              key={entry.rank}
              className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded"
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-700 dark:text-gray-300 w-6">
                  {entry.rank}
                </span>
                <span className="text-gray-800 dark:text-white">
                  {entry.name}
                </span>
              </div>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {entry.score}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

