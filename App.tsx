import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameStatus, Point, Direction, DEFAULT_THEME, GameTheme } from './types';
import { useInterval } from './hooks/useInterval';
import { getRandomPoint, checkCollision, getOppositeDirection } from './utils/gameUtils';
import SnakeCanvas from './components/SnakeCanvas';
import Controls from './components/Controls';
import { Trophy } from 'lucide-react';

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = Direction.UP;
const GAME_SPEED_BASE = 150;

export default function App() {
  // Game State
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>(getRandomPoint(INITIAL_SNAKE));
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [nextDirection, setNextDirection] = useState<Direction>(INITIAL_DIRECTION); // Buffer for next move to prevent double-turn crash
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(GAME_SPEED_BASE);

  // Theme State
  const [theme] = useState<GameTheme>(DEFAULT_THEME);

  // Touch handling
  const touchStartRef = useRef<{ x: number, y: number } | null>(null);

  // Load High Score
  useEffect(() => {
    const saved = localStorage.getItem('snake-high-score');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snake-high-score', score.toString());
    }
  }, [score, highScore]);

  // Input Handling (Keyboard)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status === GameStatus.IDLE || status === GameStatus.GAME_OVER) {
          if (e.code === 'Space') {
            setStatus(GameStatus.PLAYING);
            resetGame();
          }
          return;
      }
      
      if (e.code === 'Space') {
        setStatus(prev => prev === GameStatus.PLAYING ? GameStatus.PAUSED : GameStatus.PLAYING);
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          changeDirection(Direction.UP);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          changeDirection(Direction.DOWN);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          changeDirection(Direction.LEFT);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          changeDirection(Direction.RIGHT);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, nextDirection]); // Dependencies needed for latest state in closure

  const changeDirection = useCallback((newDir: Direction) => {
    setNextDirection(prev => {
      const opposite = getOppositeDirection(prev);
      if (newDir !== opposite && newDir !== prev) {
        return newDir;
      }
      return prev;
    });
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setNextDirection(INITIAL_DIRECTION);
    setScore(0);
    setSpeed(GAME_SPEED_BASE);
    setFood(getRandomPoint(INITIAL_SNAKE));
    setStatus(GameStatus.PLAYING);
  };

  const gameOver = () => {
    setStatus(GameStatus.GAME_OVER);
  };

  // Game Loop
  useInterval(() => {
    setDirection(nextDirection);
    
    const newHead = { ...snake[0] };

    switch (nextDirection) {
      case Direction.UP: newHead.y -= 1; break;
      case Direction.DOWN: newHead.y += 1; break;
      case Direction.LEFT: newHead.x -= 1; break;
      case Direction.RIGHT: newHead.x += 1; break;
    }

    // Check Collisions
    if (checkCollision(newHead, snake)) {
      gameOver();
      return;
    }

    const newSnake = [newHead, ...snake];

    // Eat Food
    if (newHead.x === food.x && newHead.y === food.y) {
      setScore(s => s + 10);
      setSpeed(s => Math.max(50, s * 0.98)); // Increase speed slightly
      setFood(getRandomPoint(newSnake));
      // Don't pop tail, so snake grows
    } else {
      newSnake.pop(); // Remove tail
    }

    setSnake(newSnake);
  }, status === GameStatus.PLAYING ? speed : null);


  // Swipe Handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const diffX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const diffY = e.changedTouches[0].clientY - touchStartRef.current.y;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Horizontal
      if (Math.abs(diffX) > 30) {
        changeDirection(diffX > 0 ? Direction.RIGHT : Direction.LEFT);
      }
    } else {
      // Vertical
      if (Math.abs(diffY) > 30) {
        changeDirection(diffY > 0 ? Direction.DOWN : Direction.UP);
      }
    }
    touchStartRef.current = null;
  };

  // Status handler for controls
  const handleStatusChange = (newStatus: GameStatus) => {
    if (newStatus === GameStatus.PLAYING && (status === GameStatus.GAME_OVER || status === GameStatus.IDLE)) {
        resetGame();
    } else {
        setStatus(newStatus);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-700"
      style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="flex flex-col items-center mb-6 w-full max-w-md">
        <h1 className="text-4xl font-black tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400"
            style={{ backgroundImage: `linear-gradient(to right, ${theme.snakeHeadColor}, ${theme.foodColor})` }}>
          经典贪吃蛇
        </h1>
        <div className="flex w-full justify-between items-center px-4 py-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
           <div className="flex flex-col">
             <span className="text-xs opacity-60 uppercase font-bold">当前得分</span>
             <span className="text-2xl font-mono font-bold">{score}</span>
           </div>
           <div className="flex flex-col items-end">
             <span className="text-xs opacity-60 uppercase font-bold flex items-center gap-1">
               <Trophy size={12} className="text-yellow-500" /> 历史最高
             </span>
             <span className="text-2xl font-mono font-bold">{highScore}</span>
           </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative group">
         <SnakeCanvas snake={snake} food={food} theme={theme} />
         
         {/* Overlay Messages */}
         {status === GameStatus.GAME_OVER && (
           <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl animate-in fade-in duration-300">
             <h2 className="text-3xl font-black text-white mb-2">游戏结束</h2>
             <p className="text-white/80 mb-4">最终得分: {score}</p>
             <button 
                onClick={resetGame}
                className="px-6 py-2 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
             >
               再玩一次
             </button>
           </div>
         )}
          {status === GameStatus.IDLE && (
           <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm rounded-xl">
             <div className="bg-black/60 p-6 rounded-2xl border border-white/10 text-center">
                <p className="text-white font-bold mb-4">准备好了吗？</p>
                <button 
                    onClick={() => {
                        setStatus(GameStatus.PLAYING);
                        resetGame();
                    }}
                    className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-full shadow-lg hover:shadow-emerald-500/20 hover:scale-105 transition-all"
                >
                开始游戏
                </button>
             </div>
           </div>
         )}
      </div>

      <Controls 
        gameStatus={status} 
        onDirectionChange={changeDirection} 
        onStatusChange={handleStatusChange}
        themeColor={theme.snakeHeadColor}
      />

    </div>
  );
}