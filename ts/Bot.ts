import { Point } from "./geometries/Point";
import { Line } from "./geometries/Line";
import { NeuralNetwork } from "./NeuralNetwork";
import { LevelData } from "./LevelData";
import { CollisionDetector } from "./CollisionDetector";

enum Direction{
    left = -0.04 * 1.5,
    forward = 0,
    right = 0.04 * 1.5
}

// todo create single instance of tileSize
const tileSize = 40;

export class Bot{
    constructor(posX: number, posY: number, levelData: LevelData, neuralNet?: NeuralNetwork){
        this.x = posX;
        this.y = posY;
        this.levelData = levelData;
        if(neuralNet){
            this.neuralNet = neuralNet;
        }
    }

    clone(neuralNet?: NeuralNetwork) : Bot{
        // let copy = Object.assign({}, this);
        let copy = Object.assign( Object.create( Object.getPrototypeOf(this)), this);

        copy.whenDied = null;
        copy.calculatedFitness = undefined;
        copy.rotation = 0;
        copy.isDead = false;
        copy.x = tileSize * 3;
        copy.y = tileSize * 8;
        copy.startDate = new Date();
        copy.direction = Direction.forward;
        console.log('copy', JSON.parse(JSON.stringify(copy)));
        if(neuralNet){
            copy.neuralNet = neuralNet;
        }

        // copy.update = this.update.bind(copy);
        // copy.getSensorLengths = this.getSensorLengths.bind(copy);
        // copy.getSensorLines = this.getSensorLines.bind(copy);
        // copy.getFitness = this.getFitness.bind(copy);
        // copy.clone = this.clone.bind(copy);

        // (<any>copy).__proto__ = (<any>this).__proto__;

        // console.log(copy)

        return copy;
    }

    private direction: Direction = Direction.forward;
    private collisionDetector = new CollisionDetector();
    private levelData: LevelData;
    private startDate: Date = new Date();
    private whenDied: Date | null = null;
    readonly radius = 10;
    neuralNet = new NeuralNetwork();
    calculatedFitness?: number;
    x: number;
    y: number;
    rotation = 0;
    velocity = 3*1.2;
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

    getFitness(){
        if(this.whenDied == null){
            this.whenDied = new Date(); 
        }
        return this.whenDied.getTime() - this.startDate.getTime();
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

    update(){
        if(this.isDead){
            if(this.whenDied == null){
                this.whenDied = new Date(); 
            }  
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