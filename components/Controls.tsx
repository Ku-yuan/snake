import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Play, Pause, RotateCcw } from 'lucide-react';
import { Direction, GameStatus } from '../types';

interface ControlsProps {
  onDirectionChange: (dir: Direction) => void;
  onStatusChange: (status: GameStatus) => void;
  gameStatus: GameStatus;
  themeColor: string;
}

const Controls: React.FC<ControlsProps> = ({ onDirectionChange, onStatusChange, gameStatus, themeColor }) => {
  const isPlaying = gameStatus === GameStatus.PLAYING;
  const isGameOver = gameStatus === GameStatus.GAME_OVER;

  const handleStartPause = () => {
    if (isGameOver) {
      onStatusChange(GameStatus.IDLE); // Reset
    } else if (isPlaying) {
      onStatusChange(GameStatus.PAUSED);
    } else {
      onStatusChange(GameStatus.PLAYING);
    }
  };

  const btnClass = `p-4 rounded-full bg-opacity-20 backdrop-blur-md active:scale-95 transition-transform select-none touch-manipulation shadow-lg border border-white/10`;

  return (
    <div className="flex flex-col items-center gap-6 mt-4 w-full max-w-md">
      {/* Game State Controls */}
      <div className="flex gap-4">
        <button
          onClick={handleStartPause}
          className="flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-white shadow-lg transition-all active:scale-95"
          style={{ backgroundColor: themeColor }}
        >
          {isPlaying ? <Pause size={20} /> : isGameOver ? <RotateCcw size={20} /> : <Play size={20} />}
          {isPlaying ? "暂停" : isGameOver ? "重玩" : "开始"}
        </button>
      </div>

      {/* D-Pad - Only visible on smaller screens or if user prefers */}
      <div className="grid grid-cols-3 gap-2 md:hidden">
        <div />
        <button
          className={btnClass}
          style={{ backgroundColor: `${themeColor}40` }}
          onPointerDown={(e) => { e.preventDefault(); onDirectionChange(Direction.UP); }}
        >
          <ArrowUp size={24} className="text-white" />
        </button>
        <div />

        <button
          className={btnClass}
          style={{ backgroundColor: `${themeColor}40` }}
          onPointerDown={(e) => { e.preventDefault(); onDirectionChange(Direction.LEFT); }}
        >
          <ArrowLeft size={24} className="text-white" />
        </button>
        <div className="w-14 h-14 rounded-full bg-white/5" />
        <button
          className={btnClass}
          style={{ backgroundColor: `${themeColor}40` }}
          onPointerDown={(e) => { e.preventDefault(); onDirectionChange(Direction.RIGHT); }}
        >
          <ArrowRight size={24} className="text-white" />
        </button>

        <div />
        <button
          className={btnClass}
          style={{ backgroundColor: `${themeColor}40` }}
          onPointerDown={(e) => { e.preventDefault(); onDirectionChange(Direction.DOWN); }}
        >
          <ArrowDown size={24} className="text-white" />
        </button>
        <div />
      </div>
      
      <div className="hidden md:flex text-xs text-white/50 gap-4">
        <span>使用方向键 或 WASD 移动</span>
        <span>按 空格键 开始/暂停</span>
      </div>
    </div>
  );
};

export default Controls;