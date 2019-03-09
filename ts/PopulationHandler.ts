import { Bot } from "./Bot";
import { LevelData } from "./LevelData";

export class PopulationHandler{
    constructor(private levelData: LevelData){}

    public crossover(botA: Bot, botB: Bot){
        // return botA;
        let child = botA.clone();
        child.neuralNet = botA.neuralNet.getCrossover(botB.neuralNet);

        return child;
    }
    public getNewGeneration(bots: Array<Bot>){  
        if(bots.length == 0){
            throw new Error('bots length must be > 0');
            // return new Array(5).fill(0).map((el)=>{
            //     return new Bot(40*3, 40*8, this.levelData);
            // });
        }
        bots.sort((prev, next)=>{
            return next.getFitness() - prev.getFitness();
        });
        let maxFit = bots[0].getFitness();
        bots.forEach((bot)=>{
            bot.calculatedFitness = Math.round(bot.getFitness()/maxFit * 100);
        });
        let fitnesses = bots.map((bot)=>{
            return <number>bot.calculatedFitness;
        });
        let matingPool: Bot[] = [];
        fitnesses.forEach((score, index) => {
            for(let i=0; i<score; i++){
                matingPool.push(bots[index]);
            }
        });

        let newGeneration = []
        for(let i=0; i<5; i++){
            let parentA = matingPool[Math.floor(Math.random()*matingPool.length)];
            let parentB = matingPool[Math.floor(Math.random()*matingPool.length)];
            let child = this.crossover(parentA, parentB);
            newGeneration.push(child);
        }

        return newGeneration;
        

        // todo
        // return new Array(5).fill(0).map((el)=>{
        //     return new Bot(40*3, 40*8, this.levelData);
        // });
    }
}