'use client';

import { useRef, useEffect, useState } from 'react';
import type { Creature, Difficulty, CreatureKind } from '@/types';
import { randomCreatureKind, randomAngle, distance } from '@/lib/rng';
import {
  getSpawnInterval,
  getSpeed,
  getMaxAlive,
  CONFIG,
} from '@/lib/config';
// UUID 생성 헬퍼
function generateUUID(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

interface GameCanvasProps {
  width: number;
  height: number;
  difficulty: Difficulty;
  onCreatureHit: (kind: CreatureKind) => void;
  isPlaying: boolean;
}

export default function GameCanvas({
  width,
  height,
  difficulty,
  onCreatureHit,
  isPlaying,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const creaturesRef = useRef<Creature[]>([]);
  const lastSpawnRef = useRef<number>(0);
  const animationFrameRef = useRef<number>();
  const spawnIntervalRef = useRef<number>(getSpawnInterval(difficulty));

  useEffect(() => {
    if (!isPlaying || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const maxAlive = getMaxAlive(difficulty);
    let lastTime = performance.now();

    const spawnCreature = (currentTime: number) => {
      if (creaturesRef.current.length >= maxAlive) return;

      if (currentTime - lastSpawnRef.current >= spawnIntervalRef.current) {
        const kind = randomCreatureKind(difficulty);
        const angle = randomAngle();
        const speed = getSpeed(difficulty) / 60; // px per frame (assuming 60fps)

        const creature: Creature = {
          id: generateUUID(),
          kind,
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: CONFIG.hitbox.radiusPx,
          hit: false,
        };

        creaturesRef.current.push(creature);
        lastSpawnRef.current = currentTime;
      }
    };

    const updateCreatures = (deltaTime: number) => {
      const speedMultiplier = deltaTime / 16.67; // normalize to 60fps

      creaturesRef.current = creaturesRef.current
        .filter((creature) => !creature.hit)
        .map((creature) => {
          let newX = creature.x + creature.vx * speedMultiplier;
          let newY = creature.y + creature.vy * speedMultiplier;

          // 경계 반사
          if (newX <= creature.radius || newX >= width - creature.radius) {
            creature.vx = -creature.vx;
            newX = Math.max(creature.radius, Math.min(width - creature.radius, newX));
          }
          if (newY <= creature.radius || newY >= height - creature.radius) {
            creature.vy = -creature.vy;
            newY = Math.max(creature.radius, Math.min(height - creature.radius, newY));
          }

          return {
            ...creature,
            x: newX,
            y: newY,
          };
        });
    };

    const drawCreatures = () => {
      ctx.clearRect(0, 0, width, height);

      creaturesRef.current.forEach((creature) => {
        ctx.beginPath();
        ctx.arc(creature.x, creature.y, creature.radius, 0, Math.PI * 2);

        // 생물 종류별 색상
        if (creature.kind === 'common') {
          ctx.fillStyle = '#3b82f6'; // 파란색 (일반 모기)
        } else if (creature.kind === 'malaria') {
          ctx.fillStyle = '#ef4444'; // 빨간색 (말라리아 모기)
        } else {
          ctx.fillStyle = '#fbbf24'; // 노란색 (벌)
        }

        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    };

    const handlePointerEvent = (e: PointerEvent | MouseEvent | TouchEvent) => {
      if (!isPlaying) return;

      const rect = canvas.getBoundingClientRect();
      let pointerX: number;
      let pointerY: number;

      if ('touches' in e && e.touches.length > 0) {
        pointerX = e.touches[0].clientX - rect.left;
        pointerY = e.touches[0].clientY - rect.top;
      } else {
        pointerX = (e as MouseEvent).clientX - rect.left;
        pointerY = (e as MouseEvent).clientY - rect.top;
      }

      for (const creature of creaturesRef.current) {
        if (creature.hit) continue;

        const dist = distance(pointerX, pointerY, creature.x, creature.y);
        if (dist <= creature.radius) {
          creature.hit = true;
          onCreatureHit(creature.kind);
          break; // 한 번에 하나만 처리
        }
      }
    };

    const handleClick = (e: MouseEvent) => handlePointerEvent(e);
    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      handlePointerEvent(e);
    };

    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', handleTouch);

    const gameLoop = (currentTime: number) => {
      if (!isPlaying) return;

      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      spawnCreature(currentTime);
      updateCreatures(deltaTime);
      drawCreatures();

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('touchstart', handleTouch);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      creaturesRef.current = [];
    };
  }, [isPlaying, width, height, difficulty, onCreatureHit]);

  // 난이도 변경 시 스폰 간격 재계산
  useEffect(() => {
    spawnIntervalRef.current = getSpawnInterval(difficulty);
  }, [difficulty]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 cursor-pointer"
    />
  );
}

