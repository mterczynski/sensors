import { Bot } from './bot';
import { startingBotPosition, tileSize } from './constants';
import { LevelData } from './types';

const populationSize = 5;

export class PopulationHandler {
  constructor(private levelData: LevelData) { }

  getNewGeneration(bots: Bot[]) {
    // todo - calculate bots fitnesses, generate new bots from their parents genes
    return [...Array(populationSize)].map(() => new Bot(
      startingBotPosition.x,
      startingBotPosition.y,
      this.levelData,
    ));

    // bots.sort((prev, next) => prev.getFitness() - next.getFitness()).reverse();

    // const maxFit = bots[0].getFitness();

    // bots.forEach((bot) => {
    //   bot.calculatedFitness = Math.round(bot.getFitness() / maxFit * 100);
    // });
  }
}
