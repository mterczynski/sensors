import { Bot } from "../Bot";
import { settings } from "../settings";


export function drawBot({ bot, ctx }: { bot: Bot, ctx: CanvasRenderingContext2D }) {
  ctx.fillStyle = bot.isAnomaly ?
    (bot.isDead ? settings.display.colors.bots.anomaly.deadBot : settings.display.colors.bots.anomaly.aliveBot) :
    (bot.isDead ? settings.display.colors.bots.normal.deadBot : settings.display.colors.bots.normal.aliveBot)

  ctx.beginPath();
  ctx.arc(bot.x, bot.y, bot.radius, 0, 2 * Math.PI, false);
  ctx.fill();
}
