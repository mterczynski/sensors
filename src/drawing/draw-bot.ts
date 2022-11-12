import { Bot } from '../bot';
import { colors } from '../settings';

export function drawBot({ bot, ctx }: { bot: Bot, ctx: CanvasRenderingContext2D }) {
  ctx.fillStyle = bot.isDead ?
    colors.deadBot :
    colors.aliveBot;

  ctx.beginPath();
  ctx.arc(bot.x, bot.y, bot.radius, 0, 2 * Math.PI, false);
  ctx.fill();
}
