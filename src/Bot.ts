import { CollisionDetector } from './collision-detector';
import { Line } from './geometry-classes/Line';
import { Point } from './geometry-classes/Point';
import { NeuralNetwork } from './neural-network';
import { sensorsPerBotCount, tileSize } from './settings';
import { LevelData } from './types';

const turningSpeed = 0.06;

enum Direction {
  left = -turningSpeed,
  right = turningSpeed,
}

export class Bot {
  private direction: Direction = Direction.left;
  private collisionDetector = new CollisionDetector();
  private startDate: Date = new Date();
  private whenDied?: Date;

  readonly radius = 10;
  readonly neuralNetwork: NeuralNetwork;

  calculatedFitness?: number;
  rotation = 0;
  velocity = 3 * 1.2;
  isDead = false;

  constructor(
    public x: number,
    public y: number,
    private levelData: LevelData,
    neuralNetwork?: NeuralNetwork,
  ) {
    this.neuralNetwork = neuralNetwork || new NeuralNetwork();
  }

  getSensorLines() {
    const maxLineLength = 1000;
    const deg45 = Math.PI / 4;

    const sensorLines = [...new Array(sensorsPerBotCount)].map((e, sensorIndex) => {
      const lineEnd = new Point(
        this.x + maxLineLength * Math.cos(sensorIndex * deg45 + this.rotation + Math.PI),
        this.y + (maxLineLength * Math.sin(sensorIndex * deg45 + this.rotation + Math.PI)),
      );

      const lineStart = new Point(this.x, this.y);

      return new Line(lineStart, lineEnd);
    });

    return sensorLines;
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
      const playerPos = new Point(this.x, this.y);
      let closestIntersection = new Point(Infinity, Infinity);

      this.levelData.forEach(tile => {
        const pointOfCollision = this.collisionDetector.lineRect(line, {
          height: tileSize,
          width: tileSize,
          x: tile.x * tileSize,
          y: tile.y * tileSize,
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
        throw new Error('Sensor line is not finite');
      }
    });

    return sensorValues;
  }

  tick() {
    if (this.isDead) {
      if (!this.whenDied) {
        this.whenDied = new Date();
      }

      return;
    }

    const isNeuralNetEvaluationNegative = this.neuralNetwork.evaluate(this.getSensorLengths()) < 0;

    this.direction = isNeuralNetEvaluationNegative ?
      Direction.left :
      Direction.right;

    this.rotation += this.direction;
    this.x += this.velocity * Math.cos(this.rotation - Math.PI / 2);
    this.y += this.velocity * Math.sin(this.rotation - Math.PI / 2);
  }
}
