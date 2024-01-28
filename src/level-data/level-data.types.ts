export interface Tile {
  x: number;
  y: number;
  type: string;
}

interface SpawnPosition {
  x: number,
  y: number,
  direction: number; // 0 = up, 90 = right, 180 = down, 270 = left
}

export interface LevelData {
  size: number;
  startingBotPositions: SpawnPosition[], // bots will be randomly distributed among these positions
  tiles: Tile[];
}
