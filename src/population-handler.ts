import { Bot } from "./bot";
import { Tile } from "./level-data/level-data.types";
import { populationSize, startingBotPosition, tileSize } from "./settings";

export class PopulationHandler {
  constructor(private levelTiles: Tile[]) {}

  getNewGeneration(bots: Bot[]) {
    // todo - calculate bots fitnesses, generate new bots from their parents genes
    return [...Array(populationSize)].map(
      () =>
        new Bot(
          startingBotPosition.x * tileSize,
          startingBotPosition.y * tileSize,
          this.levelTiles
        )
    );

    // bots.sort((prev, next) => prev.getFitness() - next.getFitness()).reverse();

    // const maxFit = bots[0].getFitness();

    // bots.forEach((bot) => {
    //   bot.calculatedFitness = Math.round(bot.getFitness() / maxFit * 100);
    // });
  }
}
