import { Point } from "./geometries/Point";
import { Line } from "./geometries/Line";

export class Player{
    constructor(posX: number, posY: number){
        this.x = posX;
        this.y = posY;
    }
    readonly radius = 10;
    x: number;
    y: number;
    rotation = 0;
    velocity = 3;
    isDead = false;

    getSensorLines(){
        let lines = [];
        for(let i=0; i<5; i++){
            let lineEndpoint = new Point(this.x + 1000 * Math.cos(i*Math.PI/4 + this.rotation + Math.PI), this.y + (1000 * Math.sin(i*Math.PI/4 + this.rotation + Math.PI)));
            let line = new Line(new Point(this.x, this.y), lineEndpoint);
            lines.push(line);
        }
        return lines;
    }

    turnLeft(){
        this.rotation -= 0.04;
    }

    turnRight(){
        this.rotation += 0.04;
    }

    update(){
        if(this.isDead){
            return;
        }
        this.x += this.velocity * Math.cos(this.rotation - Math.PI/2);
        this.y += this.velocity * Math.sin(this.rotation - Math.PI/2);
    }
}