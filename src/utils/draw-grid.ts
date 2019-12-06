export function drawGrid({ctx, boardWidth, boardHeight, tileSize}: {
  ctx: CanvasRenderingContext2D,
  boardWidth: number,
  boardHeight: number,
  tileSize: number,
}) {
  ctx.strokeStyle = 'rgb(200, 200, 200)';
  ctx.lineWidth = 1;

  for (let i = tileSize; i < boardWidth; i += tileSize) {
    ctx.beginPath();
    ctx.moveTo(i + 0.5, 0.5);
    ctx.lineTo(i + 0.5, boardHeight + 0.5);
    ctx.stroke();
    ctx.closePath();
  }

  for (let i = tileSize; i < boardHeight; i += tileSize) {
    ctx.beginPath();
    ctx.moveTo(0.5, i + 0.5);
    ctx.lineTo(boardWidth + 0.5, i + 0.5);
    ctx.stroke();
    ctx.closePath();
  }
}
