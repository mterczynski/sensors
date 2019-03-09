import { Bot } from "./Bot";
import { LevelData } from "./LevelData";

export class PopulationHandler {
  constructor(private levelData: LevelData) { }

  public crossover(botA: Bot, botB: Bot) {
    botA.neuralNet.getWeights();
    botB.neuralNet.getWeights();
  }

  public getNewGeneration(bots: Array<Bot>) {
    if (bots.length == 0) {
      return new Array(5).fill(0).map((el) => {
        return new Bot(40 * 3, 40 * 8, this.levelData);
      });
    }
    bots.sort((prev, next) => {
      return prev.getFitness() - next.getFitness();
    }).reverse();
    let maxFit = bots[0].getFitness();
    bots.forEach((bot) => {
      bot.calculatedFitness = Math.round(bot.getFitness() / maxFit * 100);
    });
    let matingPool = bots.map((bot) => {
      return bot.calculatedFitness;
    });
    return [];
  }
}
