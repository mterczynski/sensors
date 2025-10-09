import { settings } from "../settings";
import { Point } from "../geometry/Point";

export function drawWalls(ctx: CanvasRenderingContext2D, tiles: Array<{x: number, y: number}>) {
  tiles.forEach((wall) => {
    ctx.fillStyle = settings.display.colors.wall;
    ctx.fillRect(
      wall.x * settings.display.tileSize,
      wall.y * settings.display.tileSize,
      settings.display.tileSize,
      settings.display.tileSize,
    );
  });
}