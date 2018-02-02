import { Point } from "./Point";

export class Line{
	a: Point
	b: Point

	constructor(a: Point, b: Point){
		this.a = a;
		this.b = b;
	}
}