import { colors } from '../settings';

export function drawGrid({ ctx, boardWidth, boardHeight, tileSize }: {
  ctx: CanvasRenderingContext2D,
  boardWidth: number,
  boardHeight: number,
  tileSize: number,
}) {
  const h = 0.5; // by adding half of pixel we make lines less blurry

  ctx.strokeStyle = colors.gridLine;
  ctx.lineWidth = 1;

  drawVerticalLines();
  drawHorizontalLines();

  function drawHorizontalLines() {
    for (let rowIndex = tileSize; rowIndex < boardHeight; rowIndex += tileSize) {
      ctx.beginPath();
      ctx.moveTo(h, rowIndex + h);
      ctx.lineTo(boardWidth + h, rowIndex + h);
      ctx.stroke();
      ctx.closePath();
    }
  }

  function drawVerticalLines() {
    for (let columnIndex = tileSize; columnIndex < boardWidth; columnIndex += tileSize) {
      ctx.beginPath();
      ctx.moveTo(columnIndex + h, h);
      ctx.lineTo(columnIndex + h, boardHeight + h);
      ctx.stroke();
      ctx.closePath();
    }
  }
}
