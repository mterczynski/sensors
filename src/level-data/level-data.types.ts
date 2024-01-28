export interface Tile {
  x: number;
  y: number;
  type: string;
}

export interface LevelData {
  size: number;
  startingBotPosition: { x: number, y: number },
  tiles: Tile[];
}
