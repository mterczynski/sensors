import { Point } from "./Point";

export class Line{
	constructor(a: Point, b: Point){
		this.a = a;
		this.b = b;
	}

	a: Point
	b: Point
	getLength(){
		return this.a.distanceTo(this.b);
	}
}