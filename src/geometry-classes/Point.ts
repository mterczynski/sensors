export class Point {
  constructor(
    public x: number,
    public y: number,
  ) { }

  distanceTo(point: Point) {
    const deltaX = point.x - this.x;
    const deltaY = point.x - this.x;

    return Math.sqrt(deltaX ** 2 + deltaY ** 2);
  }
}
