export interface Point {
  x: number;
  y: number;
}

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER',
}

export interface GameTheme {
  name: string;
  backgroundColor: string;
  snakeHeadColor: string;
  snakeBodyColor: string;
  foodColor: string;
  gridColor: string;
  textColor: string;
}

export const DEFAULT_THEME: GameTheme = {
  name: "经典霓虹",
  backgroundColor: "#0f172a", // slate-900
  snakeHeadColor: "#10b981", // emerald-500
  snakeBodyColor: "#34d399", // emerald-400
  foodColor: "#f43f5e", // rose-500
  gridColor: "#1e293b", // slate-800
  textColor: "#f1f5f9", // slate-100
};