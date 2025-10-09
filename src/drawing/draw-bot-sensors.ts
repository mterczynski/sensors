import { Point } from "../geometry/Point";
import { settings } from "../settings";
import { Bot } from "../Bot";

export function drawBotSensors(
  ctx: CanvasRenderingContext2D,
  bot: Bot,
  getClosestIntersection: ({ bot, line }: { bot: Bot; line: any }) => Point
) {
  bot.getSensorLines().forEach(({ line, sensorWeight }) => {
    const closestIntersection: Point = getClosestIntersection({ bot, line });

    const { alphaAffectedByWeight } = settings.display.colors.sensorLine;

    ctx.strokeStyle =
      sensorWeight > 0
        ? `rgba(${settings.display.colors.sensorLine.positive}, ${alphaAffectedByWeight ? sensorWeight : 0.3})`
        : `rgba(${settings.display.colors.sensorLine.negative}, ${alphaAffectedByWeight ? Math.abs(sensorWeight) : 0.3})`;

    if (isFinite(closestIntersection.x)) {
      ctx.beginPath();
      ctx.moveTo(bot.x, bot.y);
      ctx.lineTo(closestIntersection.x, closestIntersection.y);
      ctx.stroke();
      ctx.closePath();
      // drawPointOfCollision should be handled in App or passed as a callback
    } else {
      throw new Error("Sensor line is not finite");
    }
  });
}