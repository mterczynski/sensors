export class Point{
	
	constructor(x:number, y:number){
		this.x = x;
		this.y = y;
	}

	x: number
	y: number

	distanceTo(point: Point){
		return Math.sqrt(Math.pow(point.x - this.x,2) + Math.pow(point.y - this.y,2));
	}
}
