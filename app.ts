import { Level } from "./ts/Level";
import { Bot } from "./ts/Bot";
import { CollisionDetector } from "./ts/CollisionDetector";
import { KeyHandler } from "./ts/KeyHandler";
import { Point } from "./ts/geometries/Point";
import { NeuralNetwork } from "./ts/NeuralNetwork";
import { Line } from "./ts/geometries/Line";

declare var Stats: any;

export class App{
    readonly tileSize = 40;
    gameCanvas = <HTMLCanvasElement> document.getElementById("gameCanvas");
    ctx = <CanvasRenderingContext2D>this.gameCanvas.getContext("2d");
    collisionDetector = new CollisionDetector();
    keyHandler = new KeyHandler();
    width = this.tileSize * 19;
    height = 19 * this.tileSize;
    levelData = new Level().getData();
    bot = new Bot(this.tileSize*3, this.tileSize*8, this.levelData);
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
    neuronWeightsDOM = {
        left: document.getElementById('neuronLeft'),
        leftCenter: document.getElementById('neuronLeftCenter'),
        center: document.getElementById('neuronCenter'),
        rightCenter: document.getElementById('neuronRightCenter'),
        right: document.getElementById('neuronRight')
    }
    stats = new Stats();
    constructor(){
        requestAnimationFrame(()=>{this.draw()});
        this.stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild( this.stats.dom );
    }
    
    draw(){
        this.stats.begin();
        this.bot.update();
        this.ctx.fillStyle = "rgb(240,240,240)";
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.drawGrid();
        this.drawObstacles();
        this.drawBotSensors();
        this.drawBot();
        this.updateStats();
        if(this.keyHandler.pressedKeys.a){
            this.bot.turnLeft();
        } 
        if(this.keyHandler.pressedKeys.d){
            this.bot.turnRight();
        }

        if(this.playerWallCollisions()){
            this.bot.isDead = true;
        }
        
        this.stats.end();

        requestAnimationFrame(()=>{this.draw()});
    }

    drawGrid(){
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 1;
        for(let i=this.tileSize; i<this.width; i+=this.tileSize){
            this.ctx.beginPath();
            this.ctx.moveTo(i +.5, 0 +.5);
            this.ctx.lineTo(i +.5, this.height +.5);
            this.ctx.stroke();
            this.ctx.closePath();
        } 
        for(let i=this.tileSize; i<this.height; i+=this.tileSize){
            this.ctx.beginPath();
            this.ctx.moveTo(0 +.5, i +.5);
            this.ctx.lineTo(this.width +.5, i +.5);
            this.ctx.stroke();
            this.ctx.closePath();
        } 
    }

    drawBot(){
        this.ctx.lineWidth = 1;
        this.ctx.fillStyle = 'rgb(100,100,255)';
        this.ctx.strokeStyle = '#003300';
        
        this.ctx.beginPath();
        this.ctx.arc(this.bot.x, this.bot.y, this.bot.radius, 0, 2 * Math.PI, false);
        this.ctx.fill();
    }

    drawBotSensors(){
        this.ctx.strokeStyle = 'rgb(200,0,0)';

        let sensorValues: Array<number> = [];

        this.bot.getSensorLines().forEach((line: Line)=>{
            let closestIntersection = new Point(Infinity, Infinity);
            let playerPos = new Point(this.bot.x, this.bot.y);
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
                this.ctx.beginPath();
                this.ctx.moveTo(this.bot.x, this.bot.y);
                this.ctx.lineTo(closestIntersection.x, closestIntersection.y);
                this.ctx.stroke();
                this.ctx.closePath();
                sensorValues.push(closestIntersection.distanceTo(playerPos));
                // draw arc where sensor detected wall:
                this.ctx.fillStyle = '#ff0000';

                this.ctx.beginPath();
                this.ctx.arc(closestIntersection.x, closestIntersection.y, 5, 0, 2 * Math.PI, false);
                this.ctx.fill();
            } else {
                throw new Error('Sensor line is too short');
                // if you want to work with limited-range sensors:

                // this.ctx.beginPath();
                // this.ctx.moveTo(this.bot.x, this.bot.y);
                // this.ctx.lineTo(line.b.x, line.b.y);
                // this.ctx.stroke();
                // this.ctx.closePath();
            }
        });

        this.sensors.left = sensorValues[0];
        this.sensors.leftCenter = sensorValues[1];
        this.sensors.center = sensorValues[2];
        this.sensors.rightCenter = sensorValues[3];
        this.sensors.right = sensorValues[4];

        return sensorValues;
    }

    drawObstacles(){
        this.levelData.forEach((tile)=>{
            this.ctx.fillStyle = "rgb(0, 200, 0)";
            this.ctx.fillRect(tile.x*this.tileSize, tile.z*this.tileSize, this.tileSize, this.tileSize);                
        });
    }

    playerWallCollisions(){
        let playerCircle = {
            x: this.bot.x,
            y: this.bot.y,
            radius: this.bot.radius,
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

    // Own stats like sensor distances, neuron weights
    updateStats(){
        this.sensorsDOM.left!.innerHTML = this.sensors.left.toFixed(2) +'';
        this.sensorsDOM.leftCenter!.innerHTML = this.sensors.leftCenter.toFixed(2) +'';
        this.sensorsDOM.center!.innerHTML = this.sensors.center.toFixed(2) +'';
        this.sensorsDOM.rightCenter!.innerHTML = this.sensors.rightCenter.toFixed(2) +'';
        this.sensorsDOM.right!.innerHTML = this.sensors.right.toFixed(2) +'';

        this.neuronWeightsDOM.left!.innerHTML = this.bot.neuralNet.getWeights()[0] + '';
        this.neuronWeightsDOM.leftCenter!.innerHTML = this.bot.neuralNet.getWeights()[1] + '';
        this.neuronWeightsDOM.center!.innerHTML = this.bot.neuralNet.getWeights()[2] + '';
        this.neuronWeightsDOM.rightCenter!.innerHTML = this.bot.neuralNet.getWeights()[3] + '';
        this.neuronWeightsDOM.right!.innerHTML = this.bot.neuralNet.getWeights()[4] + '';
    }
}

new App();