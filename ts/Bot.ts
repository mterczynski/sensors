import { Point } from "./geometries/Point";
import { Line } from "./geometries/Line";
import { NeuralNetwork } from "./NeuralNetwork";
import { LevelData } from "./LevelData";
import { CollisionDetector } from "./CollisionDetector";

enum Direction{
    left = -0.04,
    forward = 0,
    right = 0.04
}

export class Bot{
    constructor(posX: number, posY: number, levelData: LevelData){
        this.x = posX;
        this.y = posY;
        this.levelData = levelData;
    }
    private direction: Direction = Direction.forward;
    private collisionDetector = new CollisionDetector();
    private levelData: LevelData;
    readonly radius = 10;
    readonly neuralNet = new NeuralNetwork();
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

    getSensorLengths(){
        let sensorValues: Array<number> = [];

        this.getSensorLines().forEach((line)=>{
            let closestIntersection = new Point(Infinity, Infinity);
            let playerPos = new Point(this.x, this.y);
            let tileSize = 40;
            this.levelData.forEach((tile)=>{
                let collisionResult = this.collisionDetector.lineRect(line, {
                    height: tileSize,
                    width: tileSize,
                    x: tile.x * tileSize,
                    y: tile.z * tileSize 
                });

                if(collisionResult.isCollision){
                    let intersection = <Point>collisionResult.intersection;
                    if(intersection.distanceTo(playerPos) < closestIntersection.distanceTo(playerPos)){
                        closestIntersection = intersection
                    }
                }
            });  

            if(isFinite(closestIntersection.x)){
                sensorValues.push(closestIntersection.distanceTo(playerPos));
            } else {
                throw new Error('Sensor line is too short');
            }
        });
        return sensorValues;
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

        if(this.neuralNet.evaluate(this.getSensorLengths()) < 0){
            this.direction = Direction.left;
        } else {
            this.direction = Direction.right;
        }

        this.rotation += this.direction;
        this.x += this.velocity * Math.cos(this.rotation - Math.PI/2);
        this.y += this.velocity * Math.sin(this.rotation - Math.PI/2);
    }
}