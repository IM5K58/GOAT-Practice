'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Difficulty } from '@/types';

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [error, setError] = useState('');

  const handleStart = () => {
    // 이름 검증
    if (!name.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }
    if (name.trim().length > 12) {
      setError('이름은 12자 이하여야 합니다.');
      return;
    }
    if (name.trim().length < 1) {
      setError('이름은 최소 1자 이상이어야 합니다.');
      return;
    }

    setError('');
    // URL 파라미터로 게임 화면에 전달
    const params = new URLSearchParams({
      name: name.trim(),
      difficulty,
    });
    router.push(`/game?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800 dark:text-white">
          모기스내치
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          순발력 테스트 게임
        </p>

        <div className="space-y-6">
          {/* 게임 설명 */}
          <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>게임 방법:</strong>
              <br />
              60초 동안 날아다니는 생물들을 클릭/탭해서 잡으세요!
              <br />
              • 일반 모기: +1점
              <br />
              • 말라리아 모기: +3점
              <br />• 벌: -5점
            </p>
          </div>

          {/* 이름 입력 */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              이름 (1~12자)
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="이름을 입력하세요"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              maxLength={12}
            />
          </div>

          {/* 난이도 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              난이도
            </label>
            <div className="flex gap-4">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
                <label
                  key={diff}
                  className="flex items-center cursor-pointer"
                >
                  <input
                    type="radio"
                    name="difficulty"
                    value={diff}
                    checked={difficulty === diff}
                    onChange={() => setDifficulty(diff)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {diff === 'easy'
                      ? '쉬움'
                      : diff === 'medium'
                        ? '보통'
                        : '어려움'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          {/* 시작 버튼 */}
          <button
            onClick={handleStart}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            게임 시작
          </button>
        </div>
      </div>
    </div>
  );
}
