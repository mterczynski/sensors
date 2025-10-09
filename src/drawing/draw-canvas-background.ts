import { settings } from "../settings";

export function drawCanvasBackground(ctx: CanvasRenderingContext2D, boardWidth: number, boardHeight: number) {
  ctx.fillStyle = settings.display.colors.canvasBackground;
  ctx.fillRect(0, 0, boardWidth, boardHeight);
}