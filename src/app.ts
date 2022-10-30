import { Bot } from "./bot";
import { CollisionDetector } from "./collision-detector";
import { Line } from "./geometry/Line";
import { Point } from "./geometry/Point";
import { keyHandler } from "./key-handler";
import { level01 } from "./level-data";
import { PopulationHandler } from "./population-handler";
import {
  canvasBackgroundColor,
  pointOfCollisionColor,
  pointOfCollisionRadius,
  populationSize,
  sensorLineColor,
  startingBotPosition,
  tileSize,
  wallColor,
} from "./settings";
import { drawBot, drawGrid } from "./drawing";

// FPS stats visible in top left corner
declare var Stats: new () => {
  begin: () => void;
  end: () => void;
  dom: any;
  showPanel: (panelIndex: number) => void;
};

export class App {
  private readonly levelData = level01;
  private readonly populationHandler = new PopulationHandler(
    this.levelData.tiles
  );
  private readonly gameCanvas = document.getElementById(
    "gameCanvas"
  ) as HTMLCanvasElement;
  private readonly ctx = this.gameCanvas.getContext(
    "2d"
  ) as CanvasRenderingContext2D;
  private readonly collisionDetector = new CollisionDetector();
  private readonly stats = new Stats();
  private readonly boardWidth = tileSize * this.levelData.size;
  private readonly boardHeight = tileSize * this.levelData.size;

  private generationIndex = 1;
  private bots = new Array(populationSize)
    .fill(null)
    .map(
      () =>
        new Bot(
          startingBotPosition.x * tileSize,
          startingBotPosition.y * tileSize,
          this.levelData.tiles
        )
    );

  private drawCanvasBackground() {
    this.ctx.fillStyle = canvasBackgroundColor;
    this.ctx.fillRect(0, 0, this.boardWidth, this.boardHeight);
  }

  private checkForBotDeaths() {
    this.bots.forEach((bot) => {
      if (this.isBotCollidingWithWalls(bot)) {
        bot.isDead = true;
      }
    });
  }

  private drawBots() {
    this.bots.forEach((bot) => {
      this.drawBotSensors(bot);
      drawBot({ bot, ctx: this.ctx });
    });
  }

  private tickBots() {
    this.bots.forEach((bot) => bot.tick());
  }

  private checkForPopulationDeath() {
    if (this.bots.every((bot) => bot.isDead)) {
      this.bots = this.populationHandler.getNewGeneration(this.bots);
      this.updateGenerationIndex();
    }
  }

  // draws circle in place which sensor detected wall:
  private drawPointOfCollision(circleCenter: Point) {
    this.ctx.fillStyle = pointOfCollisionColor;

    this.ctx.beginPath();
    this.ctx.arc(
      circleCenter.x,
      circleCenter.y,
      pointOfCollisionRadius,
      0,
      2 * Math.PI,
      false
    );
    this.ctx.fill();
  }

  constructor() {
    requestAnimationFrame(() => this.onNextAnimationFrame());
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.stats.dom);
    keyHandler.addKeyListeners();
  }

  onNextAnimationFrame() {
    this.stats.begin();
    this.drawCanvasBackground();
    drawGrid({
      boardHeight: this.boardHeight,
      boardWidth: this.boardWidth,
      ctx: this.ctx,
      tileSize,
    });
    this.drawWalls();
    this.tickBots();
    this.drawBots();
    this.checkForBotDeaths();
    this.checkForPopulationDeath();

    this.stats.end();

    requestAnimationFrame(() => this.onNextAnimationFrame());
  }

  getClosestIntersection({ bot, line }: { bot: Bot; line: Line }) {
    let closestIntersection: Point = new Point(Infinity, Infinity);

    const botPosition = new Point(bot.x, bot.y);
    this.levelData.tiles.forEach((tile) => {
      const pointOfCollision = this.collisionDetector.lineRect(line, {
        height: tileSize,
        width: tileSize,
        x: tile.x * tileSize,
        y: tile.y * tileSize,
      });

      if (
        pointOfCollision &&
        pointOfCollision.distanceTo(botPosition) <
          closestIntersection.distanceTo(botPosition)
      ) {
        closestIntersection = pointOfCollision;
      }
    });

    return closestIntersection;
  }

  drawBotSensors(bot: Bot) {
    this.ctx.strokeStyle = sensorLineColor;

    bot.getSensorLines().forEach((line) => {
      const closestIntersection: Point = this.getClosestIntersection({
        bot,
        line,
      });

      if (isFinite(closestIntersection.x)) {
        this.ctx.beginPath();
        this.ctx.moveTo(bot.x, bot.y);
        this.ctx.lineTo(closestIntersection.x, closestIntersection.y);
        this.ctx.stroke();
        this.ctx.closePath();
        this.drawPointOfCollision(closestIntersection);
      } else {
        throw new Error("Sensor line is not finite");
        // if you want to work with limited-range sensors:

        // this.ctx.beginPath();
        // this.ctx.moveTo(this.bot.x, this.bot.y);
        // this.ctx.lineTo(line.b.x, line.b.y);
        // this.ctx.stroke();
        // this.ctx.closePath();
      }
    });
  }

  drawWalls() {
    this.levelData.tiles.forEach((wall) => {
      this.ctx.fillStyle = wallColor;
      this.ctx.fillRect(
        wall.x * tileSize,
        wall.y * tileSize,
        tileSize,
        tileSize
      );
    });
  }

  isBotCollidingWithWalls(bot: Bot) {
    const botCircle = {
      radius: bot.radius,
      x: bot.x,
      y: bot.y,
    };

    return this.levelData.tiles.some((tile) => {
      const squareRect = {
        height: tileSize,
        width: tileSize,
        x: tile.x * tileSize,
        y: tile.y * tileSize,
      };

      return this.collisionDetector.rectCircle(squareRect, botCircle)
        .isCollision;
    });
  }

  updateGenerationIndex() {
    document.getElementById("generationIndex")!.innerHTML =
      "Generation: " + ++this.generationIndex;
  }
}
