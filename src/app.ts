import { Bot } from './bot';
import { CollisionDetector } from './collision-detector';
import { tileSize } from './constants';
import { Line } from './geometry-classes/Line';
import { Point } from './geometry-classes/Point';
import { keyHandler } from './key-handler';
import { level01 } from './level-data';
import { PopulationHandler } from './population-handler';
import { drawBot, drawGrid } from './utils';

declare var Stats: new() => {
  begin: () => void,
  end: () => void,
  dom: any,
  showPanel: (panelIndex: number) => void,
};

const startingBotPosition = {x: tileSize * 3, y: tileSize * 8};
const populationSize = 5;

export class App {
  private readonly levelData = level01;
  private readonly populationHandler = new PopulationHandler(this.levelData);
  private readonly gameCanvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
  private readonly ctx = this.gameCanvas.getContext('2d') as CanvasRenderingContext2D;
  private readonly collisionDetector = new CollisionDetector();
  private readonly stats = new Stats();
  private readonly boardWidth = tileSize * 19;
  private readonly boardHeight = tileSize * 19;

  private generationIndex = 1;
  private bots = new Array(populationSize)
    .fill(0)
    .map(() => new Bot(startingBotPosition.x, startingBotPosition.y, this.levelData));

  constructor() {
    requestAnimationFrame(() => this.draw());
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.stats.dom);
    keyHandler.addKeyListeners();
  }

  draw() {
    this.stats.begin();
    this.ctx.fillStyle = 'rgb(240,240,240)';
    this.ctx.fillRect(0, 0, this.boardWidth, this.boardHeight);
    drawGrid({
      boardHeight: this.boardHeight,
      boardWidth: this.boardWidth,
      ctx: this.ctx,
      tileSize,
    });
    this.drawObstacles();
    this.bots.forEach(bot => {
      bot.tick();
      this.drawBotSensors(bot);
      drawBot({bot, ctx: this.ctx});
    });
    this.bots.forEach(bot => {
      if (this.botWallCollisions(bot)) {
        bot.isDead = true;
      }
    });

    if (this.bots.every(bot => bot.isDead)) {
      this.bots = this.populationHandler.getNewGeneration(this.bots);
      this.updateGenerationIndex();
    }

    this.stats.end();

    requestAnimationFrame(() => this.draw());
  }

  getClosestIntersection({bot, line}: {bot: Bot, line: Line}) {
    let closestIntersection: Point = new Point(Infinity, Infinity);

    const playerPos = new Point(bot.x, bot.y);
    this.levelData.forEach(tile => {
      const pointOfCollision = this.collisionDetector.lineRect(line, {
        height: tileSize,
        width: tileSize,
        x: tile.x * tileSize,
        y: tile.z * tileSize,
      });

      if (pointOfCollision && pointOfCollision.distanceTo(playerPos) < closestIntersection.distanceTo(playerPos)) {
        closestIntersection = pointOfCollision;
      }
    });

    return closestIntersection;
  }

  drawBotSensors(bot: Bot) {
    this.ctx.strokeStyle = 'rgb(200,0,0)';

    bot.getSensorLines().forEach(line => {
      const closestIntersection: Point = this.getClosestIntersection({bot, line});

      if (isFinite(closestIntersection.x)) {
        this.ctx.beginPath();
        this.ctx.moveTo(bot.x, bot.y);
        this.ctx.lineTo(closestIntersection.x, closestIntersection.y);
        this.ctx.stroke();
        this.ctx.closePath();
        // draw arc where sensor detected wall:
        this.ctx.fillStyle = '#ff0000';

        this.ctx.beginPath();
        this.ctx.arc(closestIntersection.x, closestIntersection.y, 5, 0, 2 * Math.PI, false);
        this.ctx.fill();
      } else {
        throw new Error('Sensor line is not finite');
        // if you want to work with limited-range sensors:

        // this.ctx.beginPath();
        // this.ctx.moveTo(this.bot.x, this.bot.y);
        // this.ctx.lineTo(line.b.x, line.b.y);
        // this.ctx.stroke();
        // this.ctx.closePath();
      }
    });
  }

  drawObstacles() {
    this.levelData.forEach(tile => {
      this.ctx.fillStyle = 'rgb(200, 100, 100)';
      this.ctx.fillRect(tile.x * tileSize, tile.z * tileSize, tileSize, tileSize);
    });
  }

  botWallCollisions(bot: Bot) {
    const playerCircle = {
      radius: bot.radius,
      x: bot.x,
      y: bot.y,
    };

    return this.levelData.some(tile => {
      const squareRect = {
        height: tileSize,
        width: tileSize,
        x: tile.x * tileSize,
        y: tile.z * tileSize,
      };

      return this.collisionDetector.rectCircle(squareRect, playerCircle).isCollision;
    });
  }

  updateGenerationIndex() {
    document.getElementById('generationIndex')!.innerHTML = 'Generation: ' + (++this.generationIndex);
  }
}
