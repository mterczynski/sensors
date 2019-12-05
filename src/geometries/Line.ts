import { Point } from './Point';

export class Line {
  constructor(
    public a: Point,
    public b: Point,
  ) { }

  getLength() {
    return this.a.distanceTo(this.b);
  }
}
