export class Player{
    constructor(posX: number, posY: number){
        this.x = posX;
        this.y = posY;
    }
    readonly radius = 10;
    x: number;
    y: number;
    rotation = 0;
    velocity = 5;
    isDead = false;

    getSensorLines(){
        return [];
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