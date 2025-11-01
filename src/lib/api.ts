import type { RecordRequest, LeaderboardEntry, Difficulty } from '@/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://port-0-goat-practice-back2-mhfztudd556964ed.sel3.cloudtype.app';

/**
 * 게임 결과 저장
 */
export async function submitRecord(
  record: RecordRequest,
): Promise<{ stored: boolean; id: string; rankPreview: any }> {
  const response = await fetch(`${API_BASE_URL}/api/record`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(record),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to submit record');
  }

  return response.json();
}

/**
 * 난이도별 랭킹 조회 (TOP 5)
 */
export async function getLeaderboard(
  difficulty: Difficulty,
): Promise<{ difficulty: Difficulty; top: LeaderboardEntry[] }> {
  const response = await fetch(
    `${API_BASE_URL}/api/leaderboard?difficulty=${difficulty}`,
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch leaderboard');
  }

  return response.json();
}

