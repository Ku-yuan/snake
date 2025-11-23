import React, { useRef, useEffect } from 'react';
import { GameTheme, Point } from '../types';
import { CELL_COUNT } from '../utils/gameUtils';

interface SnakeCanvasProps {
  snake: Point[];
  food: Point;
  theme: GameTheme;
}

const SnakeCanvas: React.FC<SnakeCanvasProps> = ({ snake, food, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas resolution to match display size for crisp rendering
    // We use a fixed logical size (e.g., 400x400) internally, but CSS handles responsive width
    const size = 600; 
    canvas.width = size;
    canvas.height = size;
    
    const cellSize = size / CELL_COUNT;

    // Clear background
    ctx.fillStyle = theme.backgroundColor;
    ctx.fillRect(0, 0, size, size);

    // Draw Grid (Optional, subtle)
    ctx.strokeStyle = theme.gridColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= CELL_COUNT; i++) {
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, size);
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(size, i * cellSize);
    }
    ctx.stroke();

    // Draw Food
    // Glow effect for food
    ctx.shadowBlur = 15;
    ctx.shadowColor = theme.foodColor;
    ctx.fillStyle = theme.foodColor;
    const foodRadius = cellSize * 0.4;
    const foodX = food.x * cellSize + cellSize / 2;
    const foodY = food.y * cellSize + cellSize / 2;
    
    ctx.beginPath();
    ctx.arc(foodX, foodY, foodRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0; // Reset shadow

    // Draw Snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? theme.snakeHeadColor : theme.snakeBodyColor;
      
      // Slight rounded corners for snake segments
      const segX = segment.x * cellSize + 1;
      const segY = segment.y * cellSize + 1;
      const segSize = cellSize - 2;
      const radius = 4; // corner radius

      ctx.beginPath();
      ctx.roundRect(segX, segY, segSize, segSize, radius);
      ctx.fill();

      // Eyes for head
      if (isHead) {
         ctx.fillStyle = "#fff";
         // Simple logic to position eyes based on... actually just center them for now or strictly directional
         // Let's keep it simple: two dots in the center
         ctx.beginPath();
         ctx.arc(segX + segSize * 0.3, segY + segSize * 0.3, 2, 0, Math.PI * 2);
         ctx.arc(segX + segSize * 0.7, segY + segSize * 0.3, 2, 0, Math.PI * 2);
         ctx.fill();
      }
    });

  }, [snake, food, theme]);

  return (
    <div className="relative w-full max-w-[min(90vw,500px)] aspect-square rounded-xl overflow-hidden shadow-2xl border-4 border-opacity-20"
         style={{ borderColor: theme.gridColor, backgroundColor: theme.backgroundColor }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
};

export default SnakeCanvas;