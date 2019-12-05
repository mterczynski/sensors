export class Point {
  constructor(
    public x: number,
    public y: number,
  ) { }

  distanceTo(point: Point) {
    return Math.sqrt(Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2));
  }
}
