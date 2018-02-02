import { Line } from "./interfaces/geometries/Line";
import { Rect } from "./interfaces/geometries/Rect";
import { Circle } from "./interfaces/geometries/Circle";

// based on http://www.jeffreythompson.org/collision-detection/line-rect.php

interface Result{
	isCollision: boolean
	distance?: number
}

export class CollisionDetector{
	lineRect(line: Line, rect:Rect): Result {

		// check if the line has hit any of the rectangle's sides
		// uses the Line/Line function below
		let rx = rect.x;
		let ry = rect.y;
		let rh = rect.height;
		let rw = rect.width;

		let left =   this.lineLine(line.a.x, line.a.y, line.b.x, line.b.y, rx, ry, rx, ry+rh);
		let right =  this.lineLine(line.a.x, line.a.y, line.b.x, line.b.y, rx+rw, ry, rx+rw, ry+rh);
		let top =    this.lineLine(line.a.x, line.a.y, line.b.x, line.b.y, rx, ry, rx+rw, ry);
		let bottom = this.lineLine(line.a.x, line.a.y, line.b.x, line.b.y, rx, ry+rh, rx+rw, ry+rh);

		// if ANY of the above are true, the line
		// has hit the rectangle
		if (left || right || top || bottom) {
			return {isCollision: true};
		}
		return {isCollision: false};
	}	  

	lineLine(x1:number, y1:number, x2:number, y2:number, x3:number, y3:number, x4:number, y4:number): Result {

		// calculate the direction of the lines
		let uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
		let uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

		// if uA and uB are between 0-1, lines are colliding
		if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {

			// optionally, draw a circle where the lines meet
			let intersectionX = x1 + (uA * (x2-x1));
			let intersectionY = y1 + (uA * (y2-y1));

			return {isCollision: true};
		}
		return {isCollision: false};
	}
	
	rectCircle(rect: Rect, circle: Circle) : Result{
		let deltaX = circle.x - Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
		let deltaY = circle.y - Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
		return {isCollision: (deltaX * deltaX + deltaY * deltaY) < (circle.radius * circle.radius)};
	}	
}
