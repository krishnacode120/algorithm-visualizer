import { useEffect, useRef } from 'react';
import { AlgorithmStep } from '../algorithms/types';

export function SortingCanvas({ step }: { step: AlgorithmStep }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth * dpr;
    const height = canvas.clientHeight * dpr;
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);
    const arr = step.array ?? [];
    if (!arr.length) {
      ctx.fillStyle = '#708090';
      ctx.font = `${18 * dpr}px system-ui`;
      ctx.fillText('Empty input', 24 * dpr, 42 * dpr);
      return;
    }
    const max = Math.max(...arr, 1);
    const gap = 4 * dpr;
    const barWidth = Math.max(2 * dpr, (width - gap * (arr.length + 1)) / arr.length);
    arr.forEach((value, index) => {
      const barHeight = (value / max) * (height - 54 * dpr);
      const x = gap + index * (barWidth + gap);
      const y = height - barHeight - 28 * dpr;
      const active = step.activeIndices?.includes(index);
      const sorted = step.sortedIndices?.includes(index);
      ctx.fillStyle = sorted ? '#2fbf71' : active ? '#f05454' : '#4e79a7';
      ctx.fillRect(x, y, barWidth, barHeight);
      ctx.fillStyle = '#243142';
      ctx.font = `${11 * dpr}px system-ui`;
      if (arr.length <= 24) ctx.fillText(String(value), x, height - 8 * dpr);
    });
  }, [step]);
  return <canvas className="visual-canvas" ref={canvasRef} aria-label="Sorting bars" />;
}
