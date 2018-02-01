import { Level } from "./ts/Level";
import { Player } from "./ts/Player";

export class App{
    gameCanvas = <HTMLCanvasElement> document.getElementById("gameCanvas");
    context = <CanvasRenderingContext2D>this.gameCanvas.getContext("2d");
    width = 600;
    height = 600;
    tileSize = 40;
    levelData = new Level().getData();
    player = new Player(400, 400);

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

    drawObstacles(){
        this.levelData.forEach((tile, rowIndex)=>{
            this.context.fillStyle = "rgb(0, 200, 0)";
            this.context.fillRect(tile.x*this.tileSize, tile.z*this.tileSize, this.tileSize, this.tileSize);                
        });
    }
}

new App();