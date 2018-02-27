import { Bot } from "./Bot";
import { LevelData } from "./LevelData";

export class PopulationHandler{
    constructor(private levelData: LevelData){}

    public crossover(botA: Bot, botB: Bot) : Bot{
        let randomIndex1 = Math.floor(Math.random() * 5);
        let randomIndex2 = Math.floor(Math.random() * 5);
        while(randomIndex2 == randomIndex1){
            randomIndex2 = Math.floor(Math.random() * 5);
        }
        let randomIndex3 = Math.floor(Math.random() * 5);
        let newBot = new Bot(40*2, 40*8, this.levelData);
        // console.log('parents:')
        // console.log(botA.neuralNet.getWeights());
        // console.log(botB.neuralNet.getWeights());  
        if(Math.random() > 0.5){
            newBot.neuralNet.weights = botA.neuralNet.weights.slice(0);
            newBot.neuralNet.weights[randomIndex1] = botB.neuralNet.weights[randomIndex1]; 
            newBot.neuralNet.weights[randomIndex2] = botB.neuralNet.weights[randomIndex2];
        } else {
            newBot.neuralNet.weights = botB.neuralNet.weights.slice(0);
            newBot.neuralNet.weights[randomIndex1] = botA.neuralNet.weights[randomIndex1]; 
            newBot.neuralNet.weights[randomIndex2] = botA.neuralNet.weights[randomIndex2];
        }
        
        // mutation:
        if(Math.random() < 0.01){
            newBot.neuralNet.weights[randomIndex3] = Math.random() * 200 - 100;
        }

        // console.log('child:')
        // console.log(newBot.neuralNet.getWeights())

        // newBot.neuralNet.weights.forEach((weight, index)=>{
        //     if(Math.random() < 0.01){
        //         console.log('before', newBot.neuralNet.weights.slice(0))
        //         newBot.neuralNet.weights[index] = Math.random() * 200 - 100
        //         // weight = Math.random() * 200 - 100
        //         console.log('after', newBot.neuralNet.weights.slice(0))
        //     }
        // });


        return newBot;
    }
    public getNewGeneration(bots: Array<Bot>){
        // todo change it:
        // return new Array(50).fill(0).map((el)=>{
        //     return new Bot(40 * 2, 40 * 8, this.levelData);
        // });

        if (bots.length == 0){
            throw new Error('No bots in population');
        }
        bots.sort((prev, next)=>{
            return prev.getFitness() - next.getFitness();
        }).reverse();
        let maxFit = bots[0].getFitness();
        bots.forEach((bot)=>{
            bot.calculatedFitness = Math.round(bot.getFitness()/maxFit * 100);
        });
        
        let testBots: Array<number> = [];
        bots.forEach(bot=>{
            testBots.push(<number>bot.calculatedFitness);
        })

        // console.log(testBots)

        let matingPool: Array<Bot> = [];
        let score = 25;
        bots.forEach(bot => {
            for(let j=0; j<score; j++){
                matingPool.push(bot);
            }
            score--;
        });
        console.log(score+1)

        // console.log(matingPool);

        let newBots = [];
        for(let i=0; i<bots.length; i++){
            let parentA =  matingPool[Math.floor(Math.random()*matingPool.length)];
            let parentB =  matingPool[Math.floor(Math.random()*matingPool.length)];
            newBots.push(this.crossover(parentA, parentB));
        }   
        return newBots; 
    }
}