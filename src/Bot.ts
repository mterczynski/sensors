import { CollisionDetector } from './CollisionDetector';
import { tileSize } from './constants';
import { Line } from './geometry-classes/Line';
import { Point } from './geometry-classes/Point';
import { NeuralNetwork } from './NeuralNetwork';
import { LevelData } from './types';

const turningSpeed = 0.06;

enum Direction {
  left = -turningSpeed,
  right = turningSpeed,
}

export class Bot {

  private direction: Direction = Direction.left;
  private collisionDetector = new CollisionDetector();
  private levelData: LevelData;
  private startDate: Date = new Date();
  private whenDied?: Date;

  readonly radius = 10;
  readonly neuralNet = new NeuralNetwork();

  calculatedFitness?: number;
  x: number;
  y: number;
  rotation = 0;
  velocity = 3 * 1.2;
  isDead = false;

  constructor(posX: number, posY: number, levelData: LevelData, neuralNet?: NeuralNetwork) {
    this.x = posX;
    this.y = posY;
    this.levelData = levelData;
    if (neuralNet) {
      this.neuralNet = neuralNet;
    }
  }

  getSensorLines() {
    const lines = [];

    for (let i = 0; i < 5; i++) {
      const lineEndpoint = new Point(
        this.x + 1000 * Math.cos(i * Math.PI / 4 + this.rotation + Math.PI),
        this.y + (1000 * Math.sin(i * Math.PI / 4 + this.rotation + Math.PI)),
      );

      const line = new Line(new Point(this.x, this.y), lineEndpoint);
      lines.push(line);
    }

    return lines;
  }

  getFitness() {
    if (!this.whenDied) {
      this.whenDied = new Date();
    }

    return this.whenDied.getTime() - this.startDate.getTime();
  }

  getSensorLengths() {
    const sensorValues: number[] = [];

    this.getSensorLines().forEach(line => {
      let closestIntersection = new Point(Infinity, Infinity);
      const playerPos = new Point(this.x, this.y);
      this.levelData.forEach(tile => {
        const pointOfCollision = this.collisionDetector.lineRect(line, {
          height: tileSize,
          width: tileSize,
          x: tile.x * tileSize,
          y: tile.z * tileSize,
        });

        if (pointOfCollision) {
          if (pointOfCollision.distanceTo(playerPos) < closestIntersection.distanceTo(playerPos)) {
            closestIntersection = pointOfCollision;
          }
        }
      });

      if (isFinite(closestIntersection.x)) {
        sensorValues.push(closestIntersection.distanceTo(playerPos));
      } else {
        throw new Error('Sensor line is too short');
      }
    });

    return sensorValues;
  }

  update() {
    if (this.isDead) {
      if (!this.whenDied) {
        this.whenDied = new Date();
      }

      return;
    }

    if (this.neuralNet.evaluate(this.getSensorLengths()) < 0) {
      this.direction = Direction.left;
    } else {
      this.direction = Direction.right;
    }

    this.rotation += this.direction;
    this.x += this.velocity * Math.cos(this.rotation - Math.PI / 2);
    this.y += this.velocity * Math.sin(this.rotation - Math.PI / 2);
  }
}
