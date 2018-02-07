import { NeuralNetwork } from "./NeuralNetwork";

export class NeuralNetworkVisualizer{
    constructor(net: NeuralNetwork){
        this.net = net;
        this.calcCirclesPos();
        // // helper lines:

        // for(let i=this.width/3; i<this.width; i+=this.width/3){
        //     this.ctx.beginPath();
        //     this.ctx.moveTo(i, 0);
        //     this.ctx.lineTo(i, this.height);
        //     this.ctx.stroke();
        //     this.ctx.closePath();
        // }
        // console.log(this.net)
    }
    
    private readonly width = 500;
    private readonly height = 500; 
    private canvas = <HTMLCanvasElement>document.getElementById('neuralNetCanvas');
    private ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d');
    private inputColumnCircles: Array<{x:number, y:number}> = [];
    private hiddenLayerCircles: Array<{x:number, y:number}> = [];
    private outputLayerCircles: Array<{x:number, y:number}> = [];
    net: NeuralNetwork;

    visualize(){
        this.drawLines();
        this.drawCircles();
        // this.drawText();
    }

    calcCirclesPos(){
        // input layer:
        for(let i=0; i<this.net.inputSize; i++){
            let circlePos = {x:this.width/6, y:(i+1) * this.height/(this.net.inputSize+1)};
            this.inputColumnCircles.push(circlePos);
        }

        // hidden layer:
        for(let i=0; i<this.net.hiddenLayerSize; i++){
            let circlePos = {x:this.width*(1/6 + 1/3), y:(i+1) * this.height/(this.net.hiddenLayerSize+1)};
            this.hiddenLayerCircles.push(circlePos);
        }

        // output layer:
        for(let i=0; i<this.net.outputSize; i++){
            let circlePos = {x:this.width*(1/6 + 2/3), y:(i+1) * this.height/(this.net.outputSize+1)};
            this.outputLayerCircles.push(circlePos);
        }
    }

    drawCircles(){
        this.ctx.strokeStyle = "black"
        this.ctx.fillStyle = 'blue';
        this.ctx.lineWidth = 1;

        // input layer:
        for(let i=0; i<this.net.inputSize; i++){
            this.ctx.beginPath();   
            this.ctx.arc(this.inputColumnCircles[i].x, this.inputColumnCircles[i].y, this.width/25, 0, 2*Math.PI);
            this.ctx.stroke();
            this.ctx.fill();
        }

        // hidden layer:
        for(let i=0; i<this.net.hiddenLayerSize; i++){;
            this.ctx.beginPath();
            this.ctx.arc(this.hiddenLayerCircles[i].x, this.hiddenLayerCircles[i].y, this.width/25, 0, 2*Math.PI);
            this.ctx.stroke();
            this.ctx.fill();
        }

        // output layer:
        for(let i=0; i<this.net.outputSize; i++){
            this.ctx.beginPath();
            this.ctx.arc(this.outputLayerCircles[i].x, this.outputLayerCircles[i].y, this.width/25, 0, 2*Math.PI);
            this.ctx.stroke();
            this.ctx.fill();
        }
    }

    drawLines(){
        this.ctx.strokeStyle = 'red';

        this.inputColumnCircles.forEach(inCircle => {
            this.hiddenLayerCircles.forEach(hidCircle => {
                this.ctx.beginPath();
                this.ctx.moveTo(inCircle.x, inCircle.y);
                this.ctx.lineTo(hidCircle.x, hidCircle.y);
                this.ctx.stroke();
            });
        });

        this.hiddenLayerCircles.forEach(hidCircle => {
            this.outputLayerCircles.forEach(outCircle => {
                this.ctx.beginPath();
                this.ctx.moveTo(hidCircle.x, hidCircle.y);
                this.ctx.lineTo(outCircle.x, outCircle.y);
                this.ctx.stroke();
            });
        });
    }
    
    drawText(){
        this.ctx.font = "15px Calibri";
        this.ctx.fillStyle = "rgb(255,255,255)";
        this.ctx.textAlign = "center";


        this.inputColumnCircles.forEach((circle) => {
            this.ctx.fillText("0.5", circle.x, circle.y + 3);
        });
    }
}