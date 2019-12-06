import { Bot } from './Bot';
import { CollisionDetector } from './CollisionDetector';
import { tileSize } from './constants';
import { Line } from './geometry-classes/Line';
import { Point } from './geometry-classes/Point';
import { keyHandler } from './KeyHandler';
import { level01 } from './level-data';
import { PopulationHandler } from './PopulationHandler';

declare var Stats: any;

export class App {
  private readonly levelData = level01;
  private readonly populationHandler = new PopulationHandler(this.levelData);
  private readonly gameCanvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
  private readonly ctx = this.gameCanvas.getContext('2d') as CanvasRenderingContext2D;
  private readonly collisionDetector = new CollisionDetector();

  private generationIndex = 1;
  private boardWidth = tileSize * 19;
  private boardHeight = 19 * tileSize;
  private bots = new Array(5).fill(0).map((el) => {
    return new Bot(tileSize * 3, tileSize * 8, this.levelData);
  });
  private sensors = {
    center: 0,
    left: 0,
    leftCenter: 0,
    right: 0,
    rightCenter: 0,
  };
  private sensorsDOM = {
    center: document.getElementById('sensorsCenter'),
    left: document.getElementById('sensorsLeft'),
    leftCenter: document.getElementById('sensorsLeftCenter'),
    right: document.getElementById('sensorsRight'),
    rightCenter: document.getElementById('sensorsRightCenter'),
  };
  private stats = new Stats();

  constructor() {
    requestAnimationFrame(() => { this.draw(); });
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.stats.dom);
    keyHandler.addKeyListeners();
  }

  draw() {
    this.stats.begin();
    this.ctx.fillStyle = 'rgb(240,240,240)';
    this.ctx.fillRect(0, 0, this.boardWidth, this.boardHeight);
    this.drawGrid();
    this.drawObstacles();
    this.bots.forEach((bot) => {
      bot.update();
      this.drawBotSensors(bot);
      this.drawBot(bot);
    });
    this.updateStats();
    this.bots.forEach((bot) => {
      if (this.botWallCollisions(bot)) {
        bot.isDead = true;
      }
    });

    if (this.bots.every((bot) => bot.isDead)) {
      this.bots = this.populationHandler.getNewGeneration(this.bots);
      this.updateGenerationIndex();
    }

    this.stats.end();

    requestAnimationFrame(() => { this.draw(); });
  }

  drawGrid() {
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 1;

    for (let i = tileSize; i < this.boardWidth; i += tileSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(i + .5, 0 + .5);
      this.ctx.lineTo(i + .5, this.boardHeight + .5);
      this.ctx.stroke();
      this.ctx.closePath();
    }

    for (let i = tileSize; i < this.boardHeight; i += tileSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0 + .5, i + .5);
      this.ctx.lineTo(this.boardWidth + .5, i + .5);
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }

  drawBot(bot: Bot) {
    this.ctx.lineWidth = 1;
    this.ctx.fillStyle = 'rgb(100,100,255)';
    this.ctx.strokeStyle = '#003300';

    this.ctx.beginPath();
    this.ctx.arc(bot.x, bot.y, bot.radius, 0, 2 * Math.PI, false);
    this.ctx.fill();
  }

  drawBotSensors(bot: Bot) {
    this.ctx.strokeStyle = 'rgb(200,0,0)';

    const sensorValues: number[] = [];

    bot.getSensorLines().forEach((line: Line) => {
      let closestIntersection = new Point(Infinity, Infinity);
      const playerPos = new Point(bot.x, bot.y);
      this.levelData.forEach((tile) => {
        const collisionResult = this.collisionDetector.lineRect(line, {
          height: tileSize,
          width: tileSize,
          x: tile.x * tileSize,
          y: tile.z * tileSize,
        });

        if (collisionResult.isCollision) {
          const intersection = collisionResult.intersectionPoint as Point;
          if (intersection.distanceTo(playerPos) < closestIntersection.distanceTo(playerPos)) {
            closestIntersection = intersection;
          }
        }
      });

      if (isFinite(closestIntersection.x)) {
        this.ctx.beginPath();
        this.ctx.moveTo(bot.x, bot.y);
        this.ctx.lineTo(closestIntersection.x, closestIntersection.y);
        this.ctx.stroke();
        this.ctx.closePath();
        sensorValues.push(closestIntersection.distanceTo(playerPos));
        // draw arc where sensor detected wall:
        this.ctx.fillStyle = '#ff0000';

        this.ctx.beginPath();
        this.ctx.arc(closestIntersection.x, closestIntersection.y, 5, 0, 2 * Math.PI, false);
        this.ctx.fill();
      } else {
        throw new Error('Sensor line is too short');
        // if you want to work with limited-range sensors:

        // this.ctx.beginPath();
        // this.ctx.moveTo(this.bot.x, this.bot.y);
        // this.ctx.lineTo(line.b.x, line.b.y);
        // this.ctx.stroke();
        // this.ctx.closePath();
      }
    });

    this.sensors.left = sensorValues[0];
    this.sensors.leftCenter = sensorValues[1];
    this.sensors.center = sensorValues[2];
    this.sensors.rightCenter = sensorValues[3];
    this.sensors.right = sensorValues[4];

    return sensorValues;
  }

  drawObstacles() {
    this.levelData.forEach((tile) => {
      this.ctx.fillStyle = 'rgb(0, 200, 0)';
      this.ctx.fillRect(tile.x * tileSize, tile.z * tileSize, tileSize, tileSize);
    });
  }

  botWallCollisions(bot: Bot) {
    const playerCircle = {
      radius: bot.radius,
      x: bot.x,
      y: bot.y,
    };

    return this.levelData.some((tile) => {
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

  // Own stats like sensor distances, neuron weights
  updateStats() {
    this.sensorsDOM.left!.innerHTML = this.sensors.left.toFixed(2) + '';
    this.sensorsDOM.leftCenter!.innerHTML = this.sensors.leftCenter.toFixed(2) + '';
    this.sensorsDOM.center!.innerHTML = this.sensors.center.toFixed(2) + '';
    this.sensorsDOM.rightCenter!.innerHTML = this.sensors.rightCenter.toFixed(2) + '';
    this.sensorsDOM.right!.innerHTML = this.sensors.right.toFixed(2) + '';
  }
}
