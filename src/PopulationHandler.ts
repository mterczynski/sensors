import { Bot } from "./Bot";
import { LevelData } from "./LevelData";
import { tileSize } from "./constants";

export class PopulationHandler {
  constructor(private levelData: LevelData) { }

  public crossover(botA: Bot, botB: Bot) {
    botA.neuralNet.getWeights();
    botB.neuralNet.getWeights();
  }

  public getNewGeneration(bots: Array<Bot>) {
    if (bots.length == 0) {
      return [...Array(5)].map(() => new Bot(tileSize * 3, tileSize * 8, this.levelData));
    }

    bots.sort((prev, next) => prev.getFitness() - next.getFitness()).reverse();

    let maxFit = bots[0].getFitness();

    bots.forEach((bot) => {
      bot.calculatedFitness = Math.round(bot.getFitness() / maxFit * 100);
    });

    return [];
  }
}
