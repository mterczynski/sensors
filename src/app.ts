import { CollisionDetector } from "./physics/collision-detector";
import { Line } from "./geometry/Line";
import { Point } from "./geometry/Point";
import { keyboardInputHandler } from "./keyboard-input-handler";
import { PopulationHandler } from "./machine-learning/population-handler";
import { drawGrid, drawWalls, drawBots, drawCanvasBackground } from "./drawing";
import { settings } from "./settings";
import { Bot } from "./Bot";
import Stats from "stats.js";
import _ from "lodash";

export class App {
  private readonly levelData = settings.simulation.activeLevel;
  private readonly populationHandler = new PopulationHandler(
    this.levelData.tiles,
  );
  private readonly gameCanvas = document.getElementById(
    "gameCanvas",
  ) as HTMLCanvasElement;
  private readonly ctx = this.gameCanvas.getContext(
    "2d",
  ) as CanvasRenderingContext2D;
  private readonly collisionDetector = new CollisionDetector();
  private readonly stats = new Stats();
  private readonly boardWidth = settings.display.tileSize * this.levelData.size;
  private readonly boardHeight =
    settings.display.tileSize * this.levelData.size;

  private isPaused = false;
  private previousFrameTime: number = Date.now();
  private generationIndex = 1;
  private bots = new Array(settings.simulation.populationSize)
    .fill(null)
    .map(() => {
      const startingBotPosition = _.sample(
        settings.simulation.activeLevel.startingBotPositions,
      )!;

      const bot = new Bot(
        startingBotPosition.x * settings.display.tileSize,
        startingBotPosition.y * settings.display.tileSize,
        this.levelData.tiles,
      );

      bot.setRotation(startingBotPosition.direction);

      return bot;
    });

  private checkForBotDeaths() {
    this.bots.forEach((bot) => {
      if (
        this.collisionDetector.isBotCollidingWithWalls(
          bot,
          this.levelData.tiles,
          settings.display.tileSize,
        )
      ) {
        bot.isDead = true;
      }
    });
  }

  private tickBots(delta: number) {
    this.bots.forEach((bot) => bot.tick(delta));
  }

  private checkForPopulationDeath() {
    if (this.bots.every((bot) => bot.isDead)) {
      this.bots = this.populationHandler.getNewGeneration(this.bots);
      this.updateGenerationIndex();
    }
  }

  constructor() {}

  init() {
    requestAnimationFrame(() => this.onNextAnimationFrame());
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.stats.dom);
    keyboardInputHandler.addKeyListeners();

    document.addEventListener("visibilitychange", () => {
      this.isPaused = document.hidden;
      if (!document.hidden) {
        this.previousFrameTime = Date.now();
      }
    });
  }

  onNextAnimationFrame() {
    if (this.isPaused) return;
    const now = Date.now();
    const delta = (now - this.previousFrameTime) * settings.simulation.speed;
    this.previousFrameTime = now;
    this.stats.begin();
    drawCanvasBackground(this.ctx, this.boardWidth, this.boardHeight);
    drawGrid({
      boardHeight: this.boardHeight,
      boardWidth: this.boardWidth,
      ctx: this.ctx,
      tileSize: settings.display.tileSize,
    });
    drawWalls(this.ctx, this.levelData.tiles);
    this.previousFrameTime = Date.now();
    this.tickBots(delta);
    drawBots({
      bots: this.bots,
      ctx: this.ctx,
      getClosestIntersection: this.getClosestIntersection.bind(this),
    });
    this.checkForBotDeaths();
    this.checkForPopulationDeath();
    this.updateAliveCounter(this.bots.filter((b) => !b.isDead).length);

    this.stats.end();

    requestAnimationFrame(() => this.onNextAnimationFrame());
  }

  getClosestIntersection({ bot, line }: { bot: Bot; line: Line }) {
    let closestIntersection: Point = new Point(Infinity, Infinity);

    const botPosition = new Point(bot.x, bot.y);
    this.levelData.tiles.forEach((tile) => {
      const pointOfCollision = this.collisionDetector.lineRect(line, {
        height: settings.display.tileSize,
        width: settings.display.tileSize,
        x: tile.x * settings.display.tileSize,
        y: tile.y * settings.display.tileSize,
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

  updateGenerationIndex() {
    document.getElementById("generationIndex")!.innerHTML =
      "Generation: " + ++this.generationIndex;
  }

  updateAliveCounter(aliveBotCount: number) {
    document.getElementById("aliveCounter")!.innerHTML =
      `Alive: ${aliveBotCount}/${settings.simulation.populationSize}`;
  }
}
