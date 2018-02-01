import { Level } from "./ts/Level";
import { Player } from "./ts/Player";
import { CollisionDetector } from "./ts/CollisionDetector";

export class App{
    gameCanvas = <HTMLCanvasElement> document.getElementById("gameCanvas");
    context = <CanvasRenderingContext2D>this.gameCanvas.getContext("2d");
    collisionDetector = new CollisionDetector();
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
        this.context.fillStyle = "rgb(240,240,240)";
        this.context.fillRect(0, 0, this.width, this.height);
        this.drawGrid();
        this.drawObstacles();
        this.drawPlayerSensors();
        this.drawPlayer();
        this.player.rotation += Math.PI / 240;
        console.log(this.player.rotation)

        requestAnimationFrame(()=>{this.draw()});
    }

    drawGrid(){
        this.context.strokeStyle = "black";
        this.context.lineWidth = 1;
        for(let i=this.tileSize; i<this.width; i+=this.tileSize){
            this.context.moveTo(i + 0.5, 0.5);
            this.context.lineTo(i + 0.5, this.height + 0.5);
            this.context.stroke();
        } 
        for(let i=this.tileSize; i<this.height; i+=this.tileSize){
            this.context.moveTo(0.5, i + 0.5);
            this.context.lineTo(this.width + 0.5, i + 0.5);
            this.context.stroke();
        } 
    }

    drawPlayer(){
        var radius = 8;

        this.context.beginPath();
        this.context.arc(this.player.x, this.player.y, radius, 0, 2 * Math.PI, false);
        this.context.fillStyle = 'rgb(100,100,255)';
        this.context.fill();
        this.context.lineWidth = 2;
        this.context.strokeStyle = '#003300';
        this.context.stroke();
    }

    drawPlayerSensors(){
        for(let i=Math.PI; i<=2*Math.PI; i+= Math.PI/4){
            this.context.beginPath();
            this.context.strokeStyle = 'rgb(200,0,0)';
            this.context.moveTo(this.player.x, this.player.y);
            this.context.lineTo(this.player.x + (200 * Math.cos(i + this.player.rotation)), this.player.y + (200 * Math.sin(i + this.player.rotation)));
            this.context.stroke();
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