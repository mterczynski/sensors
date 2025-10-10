import { settings } from "../settings";
import { Point } from "../geometry/Point";

export function drawBarChart(
  ctx: CanvasRenderingContext2D,
  position: Point,
  barWidth: number,
  maxBarHeight: number,
  values: number[],
) {
  const maxValue = Math.max(...values);
  const scale = maxValue > 0 ? maxBarHeight / maxValue : 0;

  values.forEach((value, index) => {
    const barHeight = value * scale;
    const x = index * (barWidth + 2) + position.x;
    const y = maxBarHeight - barHeight + position.y;

    ctx.fillStyle = "blue";
    ctx.fillRect(x, y, barWidth, barHeight);
  });
}
