import { Circle } from './geometry-classes/Circle';
import { Line } from './geometry-classes/Line';
import { Point } from './geometry-classes/Point';

// based on http://www.jeffreythompson.org/collision-detection/line-rect.php

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CollisionCheckResult {
  isCollision: boolean;
  intersectionPoint?: Point;
}

export class CollisionDetector {
  lineRect(line: Line, rect: Rect): Point | null {

    // check if the line has hit any of the rectangle's sides
    // uses the Line/Line function below
    const rx = rect.x;
    const ry = rect.y;
    const rh = rect.height;
    const rw = rect.width;

    const left = this.lineLine(line.a.x, line.a.y, line.b.x, line.b.y, rx, ry, rx, ry + rh);
    const right = this.lineLine(line.a.x, line.a.y, line.b.x, line.b.y, rx + rw, ry, rx + rw, ry + rh);
    const top = this.lineLine(line.a.x, line.a.y, line.b.x, line.b.y, rx, ry, rx + rw, ry);
    const bottom = this.lineLine(line.a.x, line.a.y, line.b.x, line.b.y, rx, ry + rh, rx + rw, ry + rh);

    let closestIntersection = new Point(Infinity, Infinity);

    [left, right, top, bottom].forEach(dir => {
      if (!dir.isCollision) {
        return;
      }
      if (!dir.intersectionPoint) {
        throw new Error('missing intersection point');
      }
      if (dir.intersectionPoint.distanceTo(line.a) < closestIntersection.distanceTo(line.a)) {
        closestIntersection = (dir.intersectionPoint as Point);
      }
    });

    // if ANY of the above are true, the line
    // has hit the rectangle
    if (left.isCollision || right.isCollision || top.isCollision || bottom.isCollision) {
      return closestIntersection;
    }

    return null;
  }

  lineLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    x4: number,
    y4: number,
  ): CollisionCheckResult {

    // calculate the direction of the lines
    const uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
    const uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

    // if uA and uB are between 0-1, lines are colliding
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {

      // optionally, draw a circle where the lines meet
      const intersectionX = x1 + (uA * (x2 - x1));
      const intersectionY = y1 + (uA * (y2 - y1));

      return { isCollision: true, intersectionPoint: new Point(intersectionX, intersectionY) };
    }

    return { isCollision: false };
  }

  rectCircle(rect: Rect, circle: Circle): CollisionCheckResult {
    const deltaX = circle.x - Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    const deltaY = circle.y - Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));

    return { isCollision: (deltaX * deltaX + deltaY * deltaY) < (circle.radius * circle.radius) };
  }
}
