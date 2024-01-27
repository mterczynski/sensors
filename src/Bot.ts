import { CollisionDetector } from "./collision-detector";
import { Line } from "./geometry/Line";
import { Point } from "./geometry/Point";
import { Tile } from "./level-data/level-data.types";
import { NeuralNetwork } from "./neural-network";
import { sensorAngle, sensorsPerBotCount, tileSize } from "./settings";

const turningSpeed = 0.004;

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

  rotation = 0;
  velocity = 0.24;
  isDead = false;

  constructor(
    public x: number,
    public y: number,
    private levelTiles: Tile[],
    public readonly isAnomaly = false,
    neuralNetwork?: NeuralNetwork
  ) {
    this.neuralNetwork = neuralNetwork || new NeuralNetwork();
  }

  getSensorLines() {
    const maxLineLength = 1000;
    const degree = Math.PI / 180 * sensorAngle;

    const sensorLines = [...new Array(sensorsPerBotCount)].map(
      (e, sensorIndex) => {
        const lineEnd = new Point(
          this.x +
          maxLineLength *
          Math.cos(sensorIndex * degree + this.rotation + Math.PI),
          this.y +
          maxLineLength *
          Math.sin(sensorIndex * degree + this.rotation + Math.PI)
        );

        const lineStart = new Point(this.x, this.y);

        return new Line(lineStart, lineEnd);
      }
    );

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

    this.getSensorLines().forEach((line) => {
      const playerPos = new Point(this.x, this.y);
      let closestIntersection = new Point(Infinity, Infinity);

      this.levelTiles.forEach((tile) => {
        const pointOfCollision = this.collisionDetector.lineRect(line, {
          height: tileSize,
          width: tileSize,
          x: tile.x * tileSize,
          y: tile.y * tileSize,
        });

        if (
          pointOfCollision &&
          pointOfCollision.distanceTo(playerPos) <
          closestIntersection.distanceTo(playerPos)
        ) {
          closestIntersection = pointOfCollision;
        }
      });

      if (isFinite(closestIntersection.x)) {
        sensorValues.push(closestIntersection.distanceTo(playerPos));
      } else {
        throw new Error("Sensor line is not finite");
      }
    });

    return sensorValues;
  }

  tick(delta: number) {
    if (this.isDead) {
      if (!this.whenDied) {
        this.whenDied = new Date();
      }

      return;
    }

    const isNeuralNetEvaluationNegative =
      this.neuralNetwork.evaluate(this.getSensorLengths()) < 0;

    this.direction = isNeuralNetEvaluationNegative
      ? Direction.left
      : Direction.right;

    this.rotation += this.direction * delta;

    this.x += this.velocity * Math.cos(this.rotation - Math.PI / 2) * delta;
    this.y += this.velocity * Math.sin(this.rotation - Math.PI / 2) * delta;
  }
}
