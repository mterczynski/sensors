import { Level } from "./ts/Level";
import { Player } from "./ts/Player";
import { CollisionDetector } from "./ts/CollisionDetector";
import { KeyHandler } from "./ts/KeyHandler";

export class App{
    gameCanvas = <HTMLCanvasElement> document.getElementById("gameCanvas");
    context = <CanvasRenderingContext2D>this.gameCanvas.getContext("2d");
    collisionDetector = new CollisionDetector();
    keyHandler = new KeyHandler();
    width = 600;
    height = 600;
    tileSize = 40;
    levelData = new Level().getData();
    player = new Player(this.tileSize* 12.5, this.tileSize* 8.5);

    constructor(){
        requestAnimationFrame(()=>{this.draw()});
        this.context.beginPath();
        this.drawObstacles();
    }

    draw(){
        this.player.update();
        this.context.fillStyle = "rgb(240,240,240)";
        this.context.fillRect(0, 0, this.width, this.height);
        this.drawGrid();
        this.drawObstacles();
        this.drawPlayerSensors();
        
        this.drawPlayer();
        if(this.keyHandler.pressedKeys.a){
            this.player.turnLeft();
        } 
        if(this.keyHandler.pressedKeys.d){
            this.player.turnRight();
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
            this.context.lineTo(this.width +.5, i + .5);
            this.context.stroke();
            this.context.closePath();
        } 
    }

    drawPlayer(){
        let radius = 10;
        this.context.lineWidth = 1;
        this.context.fillStyle = 'rgb(100,100,255)';
        this.context.strokeStyle = '#003300';
        
        this.context.beginPath();
        this.context.arc(this.player.x, this.player.y, radius, 0, 2 * Math.PI, false);
        this.context.fill();
    }

    drawPlayerSensors(){
        for(let i=Math.PI; i<=2*Math.PI; i+= Math.PI/4){
            this.context.beginPath();
            this.context.strokeStyle = 'rgb(200,0,0)';
            this.context.moveTo(this.player.x, this.player.y);
            this.context.lineTo(this.player.x + (200 * Math.cos(i + this.player.rotation)), this.player.y + (200 * Math.sin(i + this.player.rotation)));
            this.context.stroke();
            this.context.closePath();
        }
    }

    drawObstacles(){
        this.levelData.forEach((tile, rowIndex)=>{
            this.context.fillStyle = "rgb(0, 200, 0)";
            this.context.fillRect(tile.x*this.tileSize, tile.z*this.tileSize, this.tileSize, this.tileSize);                
        });
    }
}

new App();