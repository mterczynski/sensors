import { Level } from "./ts/Level";
import { Player } from "./ts/Player";
import { CollisionDetector } from "./ts/CollisionDetector";
import { KeyHandler } from "./ts/KeyHandler";
import { Point } from "./ts/interfaces/geometries/Point";

export class App{
    gameCanvas = <HTMLCanvasElement> document.getElementById("gameCanvas");
    context = <CanvasRenderingContext2D>this.gameCanvas.getContext("2d");
    collisionDetector = new CollisionDetector();
    keyHandler = new KeyHandler();
    width = 600;
    height = 600;
    tileSize = 40;
    levelData = new Level().getData();
    player = new Player(this.tileSize*12.5, this.tileSize*8.5);
    sensors = {
        left: 0,
        leftCenter: 0,
        center: 0,
        rightCenter: 0,
        right: 0
    }
    sensorsDOM = {
        left: document.getElementById('sensorsLeft'),
        leftCenter: document.getElementById('sensorsLeftCenter'),
        center: document.getElementById('sensorsCenter'),
        rightCenter: document.getElementById('sensorsRightCenter'),
        right: document.getElementById('sensorsRight')
    }

    constructor(){
        requestAnimationFrame(()=>{this.draw()});
    }
    
    draw(){
        this.player.update();
        this.context.fillStyle = "rgb(240,240,240)";
        this.context.fillRect(0, 0, this.width, this.height);
        this.drawGrid();
        this.drawObstacles();
        this.drawPlayerSensors();
        this.drawPlayer();
        this.updateStats();
        if(this.keyHandler.pressedKeys.a){
            this.player.turnLeft();
        } 
        if(this.keyHandler.pressedKeys.d){
            this.player.turnRight();
        }

        if(this.playerWallCollisions()){
            this.player.isDead = true;
        }
        
        requestAnimationFrame(()=>{this.draw()});
    }

    drawGrid(){
        this.context.strokeStyle = "black";
        this.context.lineWidth = 1;
        for(let i=this.tileSize; i<this.width; i+=this.tileSize){
            this.context.beginPath();
            this.context.moveTo(i +.5, 0 +.5);
            this.context.lineTo(i +.5, this.height +.5);
            this.context.stroke();
            this.context.closePath();
        } 
        for(let i=this.tileSize; i<this.height; i+=this.tileSize){
            this.context.beginPath();
            this.context.moveTo(0 +.5, i +.5);
            this.context.lineTo(this.width +.5, i +.5);
            this.context.stroke();
            this.context.closePath();
        } 
    }

    drawPlayer(){
        this.context.lineWidth = 1;
        this.context.fillStyle = 'rgb(100,100,255)';
        this.context.strokeStyle = '#003300';
        
        this.context.beginPath();
        this.context.arc(this.player.x, this.player.y, this.player.radius, 0, 2 * Math.PI, false);
        this.context.fill();
    }

    drawPlayerSensors(){
        this.context.strokeStyle = 'rgb(200,0,0)';

        let sensorValues: Array<number> = [];

        this.player.getSensorLines().forEach((line)=>{
            let closestIntersection = new Point(Infinity, Infinity);
            let playerPos = new Point(this.player.x, this.player.y);
            this.levelData.forEach((tile)=>{
                let collisionResult = this.collisionDetector.lineRect(line, {
                    height: this.tileSize,
                    width: this.tileSize,
                    x: tile.x * this.tileSize,
                    y: tile.z * this.tileSize 
                });
                
                if(collisionResult.isCollision){
                    let intersection = <Point>collisionResult.intersection;
                    if(intersection.distanceTo(playerPos) < closestIntersection.distanceTo(playerPos)){
                        closestIntersection = intersection
                    }
                }
            });  
            
            if(isFinite(closestIntersection.x)){
                this.context.beginPath();
                this.context.moveTo(this.player.x, this.player.y);
                this.context.lineTo(closestIntersection.x, closestIntersection.y);
                this.context.stroke();
                this.context.closePath();
                sensorValues.push(closestIntersection.distanceTo(playerPos));
                // draw arc where sensor detected wall:
                this.context.fillStyle = '#ff0000';

                this.context.beginPath();
                this.context.arc(closestIntersection.x, closestIntersection.y, 5, 0, 2 * Math.PI, false);
                this.context.fill();
            } else {
                throw new Error('Sensor line is too short');
                // if you want to work with limited-range sensors:

                // this.context.beginPath();
                // this.context.moveTo(this.player.x, this.player.y);
                // this.context.lineTo(line.b.x, line.b.y);
                // this.context.stroke();
                // this.context.closePath();
            }
        });

        this.sensors.left = sensorValues[0];
        this.sensors.leftCenter = sensorValues[1];
        this.sensors.center = sensorValues[2];
        this.sensors.rightCenter = sensorValues[3];
        this.sensors.right = sensorValues[4];
    }

    drawObstacles(){
        this.levelData.forEach((tile)=>{
            this.context.fillStyle = "rgb(0, 200, 0)";
            this.context.fillRect(tile.x*this.tileSize, tile.z*this.tileSize, this.tileSize, this.tileSize);                
        });
    }

    playerWallCollisions(){
        let playerCircle = {
            x: this.player.x,
            y: this.player.y,
            radius: this.player.radius,
        }
        return this.levelData.some((tile)=>{
            let squareRect = {
                x: tile.x * this.tileSize,
                y: tile.z * this.tileSize,
                width: this.tileSize,
                height: this.tileSize
            }
            return this.collisionDetector.rectCircle(squareRect, playerCircle).isCollision;
        });
    }

    updateStats(){
        this.sensorsDOM.left!.innerHTML = this.sensors.left.toFixed(2) +'';
        this.sensorsDOM.leftCenter!.innerHTML = this.sensors.leftCenter.toFixed(2) +'';
        this.sensorsDOM.center!.innerHTML = this.sensors.center.toFixed(2) +'';
        this.sensorsDOM.rightCenter!.innerHTML = this.sensors.rightCenter.toFixed(2) +'';
        this.sensorsDOM.right!.innerHTML = this.sensors.right.toFixed(2) +'';
    }
}

new App();