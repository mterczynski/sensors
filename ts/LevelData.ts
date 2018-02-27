interface Tile{
    id: number,
    x: number | string,
    z: number | string,
    type: string  
}

export type LevelData = Array<Tile>
