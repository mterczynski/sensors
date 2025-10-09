import { drawBot } from "./draw-bot";
import { drawBotSensors } from "./draw-bot-sensors";
import { settings } from "../settings";
import { Bot } from "../Bot";

export function drawBots({
  bots,
  ctx,
  getClosestIntersection,
}: {
  bots: Bot[];
  ctx: CanvasRenderingContext2D;
  getClosestIntersection: ({ bot, line }: { bot: Bot; line: any }) => any;
}) {
  let drawnSensors = 0;
  bots.forEach((bot) => {
    const canDrawDead = bot.isDead && settings.display.drawDeadBotSensors;
    const canDrawAlive = !bot.isDead && settings.display.drawAliveBotSensors;
    const isDrawLimitKept =
      settings.display.maxBotsWithDrawnSensors > drawnSensors;
    const canDraw = (canDrawDead || canDrawAlive) && isDrawLimitKept;

    if (canDraw) {
      drawBotSensors(ctx, bot, getClosestIntersection);
      drawnSensors++;
    }

    drawBot({ bot, ctx });
  });
}
