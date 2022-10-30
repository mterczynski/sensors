export interface Tile {
  x: number;
  y: number;
  type: string;
}

export interface LevelData {
  size: number;
  tiles: Tile[];
}
