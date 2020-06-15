import { Bot } from '../bot';
import { aliveBotColor, deadBotColor } from '../settings';

export function drawBot({bot, ctx}: {bot: Bot, ctx: CanvasRenderingContext2D}) {
  ctx.fillStyle = bot.isDead ?
    deadBotColor :
    aliveBotColor;

  ctx.beginPath();
  ctx.arc(bot.x, bot.y, bot.radius, 0, 2 * Math.PI, false);
  ctx.fill();
}
