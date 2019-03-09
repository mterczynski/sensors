interface Tile {
  id: number,
  x: number,
  z: number,
  type: string
}

export type LevelData = Tile[]
