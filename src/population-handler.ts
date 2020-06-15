import { Bot } from './bot';
import { populationSize, startingBotPosition, tileSize } from './constants';
import { LevelData } from './types';

export class PopulationHandler {
  constructor(private levelData: LevelData) { }

  getNewGeneration(bots: Bot[]) {
    // todo - calculate bots fitnesses, generate new bots from their parents genes
    return [...Array(populationSize)].map(() => new Bot(
      startingBotPosition.x * tileSize,
      startingBotPosition.y * tileSize,
      this.levelData,
    ));

    // bots.sort((prev, next) => prev.getFitness() - next.getFitness()).reverse();

    // const maxFit = bots[0].getFitness();

    // bots.forEach((bot) => {
    //   bot.calculatedFitness = Math.round(bot.getFitness() / maxFit * 100);
    // });
  }
}
