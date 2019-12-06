import { Bot } from './Bot';
import { tileSize } from './constants';
import { LevelData } from './types';

const populationSize = 5;

export class PopulationHandler {
  constructor(private levelData: LevelData) { }

  getNewGeneration(bots: Bot[]) {
    if (bots.length === 0) {
      return [...Array(populationSize)].map(() => new Bot(tileSize * 3, tileSize * 8, this.levelData));
    }

    // bots.sort((prev, next) => prev.getFitness() - next.getFitness()).reverse();

    // const maxFit = bots[0].getFitness();

    // bots.forEach((bot) => {
    //   bot.calculatedFitness = Math.round(bot.getFitness() / maxFit * 100);
    // });

    return [...Array(populationSize)].map(() => new Bot(tileSize * 3, tileSize * 8, this.levelData));
  }
}
