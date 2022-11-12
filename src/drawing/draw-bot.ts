import { Bot } from '../bot';
import { colors } from '../settings';

export function drawBot({ bot, ctx }: { bot: Bot, ctx: CanvasRenderingContext2D }) {
  ctx.fillStyle = bot.isAnomaly ?
    (bot.isDead ? colors.bots.anomaly.deadBot : colors.bots.anomaly.aliveBot) :
    (bot.isDead ? colors.bots.normal.deadBot : colors.bots.normal.aliveBot)

  ctx.beginPath();
  ctx.arc(bot.x, bot.y, bot.radius, 0, 2 * Math.PI, false);
  ctx.fill();
}
