'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import GameCanvas from '@/components/GameCanvas';
import HUD from '@/components/HUD';
import Leaderboard from '@/components/Leaderboard';
import type { Difficulty, CreatureKind } from '@/types';
import { CONFIG } from '@/lib/config';
import { submitRecord } from '@/lib/api';

export default function GamePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const name = searchParams.get('name') || '';
  const difficulty = (searchParams.get('difficulty') || 'medium') as Difficulty;

  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(CONFIG.durationMs);
  const [score, setScore] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // 포획 기록 추적 (평균 포획 시간 계산용)
  const catchTimesRef = useRef<number[]>([]);
  const gameStartTimeRef = useRef<number>(0);
  const lastCatchTimeRef = useRef<number>(0);

  const handleCreatureHit = useCallback(
    (kind: CreatureKind) => {
      if (!isPlaying || gameEnded) return;

      // 점수 업데이트
      const points = CONFIG.scores[kind];
      setScore((prev) => prev + points);

      // 포획 시간 기록
      const now = Date.now();
      if (lastCatchTimeRef.current > 0) {
        // 이전 포획 이후 경과 시간
        const catchTime = now - lastCatchTimeRef.current;
        catchTimesRef.current.push(catchTime);
      } else {
        // 첫 포획: 게임 시작 후 경과 시간
        const elapsed = now - gameStartTimeRef.current;
        if (elapsed > 0) {
          catchTimesRef.current.push(elapsed);
        }
      }
      lastCatchTimeRef.current = now;
    },
    [isPlaying, gameEnded],
  );

  const startGame = () => {
    setIsPlaying(true);
    setTimeLeft(CONFIG.durationMs);
    setScore(0);
    setGameEnded(false);
    setSubmitted(false);
    catchTimesRef.current = [];
    gameStartTimeRef.current = Date.now();
    lastCatchTimeRef.current = 0;
  };

  useEffect(() => {
    if (!isPlaying || gameEnded) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 100;
        if (newTime <= 0) {
          setIsPlaying(false);
          setGameEnded(true);
          return 0;
        }
        return newTime;
      });
    }, 100); // 0.1초마다 업데이트

    return () => clearInterval(interval);
  }, [isPlaying, gameEnded]);

  // 게임 종료 시 자동 점수 제출
  useEffect(() => {
    if (!gameEnded || submitted || submitting) return;

    const submitScore = async () => {
      setSubmitting(true);
      try {
        const durationMs = CONFIG.durationMs;
        const caught = catchTimesRef.current.length;
        const avgCatchMs =
          caught > 0
            ? Math.round(
                catchTimesRef.current.reduce((a, b) => a + b, 0) / caught,
              )
            : 0;

        await submitRecord({
          name,
          difficulty,
          score,
          durationMs,
          avgCatchMs,
          caught,
        });

        setSubmitted(true);
      } catch (error) {
        console.error('Failed to submit score:', error);
        alert('점수 제출에 실패했습니다. 다시 시도해주세요.');
      } finally {
        setSubmitting(false);
      }
    };

    submitScore();
  }, [gameEnded, submitted, submitting, name, difficulty, score]);

  // 이름이나 난이도가 없으면 홈으로 리다이렉트
  useEffect(() => {
    if (!name || !difficulty) {
      router.push('/');
    }
  }, [name, difficulty, router]);

  const handleRestart = () => {
    router.push('/');
  };

  // 캔버스 크기 계산 (반응형)
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateSize = () => {
      const isMobile = window.innerWidth < 768;
      setCanvasSize({
        width: isMobile ? Math.min(400, window.innerWidth - 32) : 600,
        height: isMobile ? 400 : 500,
      });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center">
            모기스내치
          </h1>
        </div>

        {/* 메인 레이아웃: 모바일은 단일 열, 데스크톱은 좌우 2열 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* 게임 캔버스 영역 */}
          <div className="lg:col-span-2 flex flex-col items-center">
            {!isPlaying && !gameEnded && (
              <div className="mb-4 text-center">
                <button
                  onClick={startGame}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  게임 시작
                </button>
              </div>
            )}

            {gameEnded && (
              <div className="mb-4 text-center space-y-2">
                <div className="text-2xl font-bold text-gray-800 dark:text-white">
                  게임 종료!
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-400">
                  최종 점수: {score}
                </div>
                {submitting && (
                  <div className="text-sm text-gray-500">점수 제출 중...</div>
                )}
                {submitted && (
                  <div className="text-sm text-green-600 dark:text-green-400">
                    점수가 제출되었습니다!
                  </div>
                )}
                <button
                  onClick={handleRestart}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
                >
                  다시 시작
                </button>
              </div>
            )}

            <GameCanvas
              width={canvasSize.width}
              height={canvasSize.height}
              difficulty={difficulty}
              onCreatureHit={handleCreatureHit}
              isPlaying={isPlaying}
            />
          </div>

          {/* 우측 패널: HUD와 Leaderboard */}
          <div className="space-y-4">
            <HUD
              name={name}
              difficulty={difficulty}
              timeLeft={timeLeft}
              score={score}
            />
            <Leaderboard
              difficulty={difficulty}
              refreshKey={submitted ? Date.now() : 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

