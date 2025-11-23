import { Point, Direction } from '../types';

export const GRID_SIZE = 20;
export const CELL_COUNT = 20; // 20x20 grid

export const getRandomPoint = (exclude: Point[] = []): Point => {
  let point: Point;
  let isExcluded = true;
  
  while (isExcluded) {
    point = {
      x: Math.floor(Math.random() * CELL_COUNT),
      y: Math.floor(Math.random() * CELL_COUNT),
    };
    // eslint-disable-next-line no-loop-func
    isExcluded = exclude.some(p => p.x === point.x && p.y === point.y);
  }
  return point!;
};

export const getOppositeDirection = (dir: Direction): Direction => {
  switch (dir) {
    case Direction.UP: return Direction.DOWN;
    case Direction.DOWN: return Direction.UP;
    case Direction.LEFT: return Direction.RIGHT;
    case Direction.RIGHT: return Direction.LEFT;
  }
};

export const checkCollision = (head: Point, body: Point[]): boolean => {
  // Wall collision
  if (head.x < 0 || head.x >= CELL_COUNT || head.y < 0 || head.y >= CELL_COUNT) {
    return true;
  }
  // Self collision
  for (const segment of body) {
    if (head.x === segment.x && head.y === segment.y) {
      return true;
    }
  }
  return false;
};