import { Bot } from "./bot";
import { randomlyDistributeResources } from "./randomly-distribute-resources";
import { Tile } from "./level-data/level-data.types";
import { anomaliesChance, distributionFunction, maxMutationChange, mutationChance, sensorsPerBotCount, startingBotPosition, tileSize } from "./settings";
import { NeuralNetwork } from "./neural-network";

function formatWeights(weights: number[]) {
  return weights.map((weight: number) => Math.round(weight * 100) / 100)
}

export class PopulationHandler {
  constructor(private levelTiles: Tile[]) { }

  getNewGeneration(bots: Bot[]): Bot[] {
    const weightsAll: any[] = []

    const botsOrderedByFitness = [...bots].sort((prev, next) => next.getFitness() - prev.getFitness());
    const offspringPerBot = randomlyDistributeResources(bots.length, distributionFunction);
    const newGeneration = Array(bots.length).fill(0).map((_, botIndex) => {
      const parent: Bot = botsOrderedByFitness[botIndex];
      return Array(offspringPerBot[botIndex]).fill(null).map(() => {
        let neuralNetwork = parent.neuralNetwork.clone()

        const isAnomaly = Math.random() < anomaliesChance

        if (isAnomaly) {
          neuralNetwork = new NeuralNetwork()
        } else {
          for (let i = 0; i < sensorsPerBotCount; i++) {
            neuralNetwork.weights[i] += mutationChance > Math.random() ? maxMutationChange * (Math.random() - 0.5) : 0
          }
        }

        const child = new Bot(
          startingBotPosition.x * tileSize,
          startingBotPosition.y * tileSize,
          this.levelTiles,
          isAnomaly,
          neuralNetwork
        )

        weightsAll.push(neuralNetwork.weights)

        return child;
      })
    }).flat()

    const weightsSum = weightsAll.slice(1).reduce((acc, nextBotWeights) => {
      return Array(sensorsPerBotCount).fill(0).map((_, index) => {
        return acc[index] + nextBotWeights[index]
      })
    }, weightsAll[0]
    );

    const weightsAvg = weightsSum.map((weightSum: number) => weightSum / bots.length)

    console.log('avg', formatWeights(weightsAvg))

    return newGeneration
    // const fitnesses = bots.map((bot) => bot.getFitness());
    // const maxFitness = Math.max(...fitnesses);
    // const normalizedFitnesses = fitnesses.map(
    //   (fitness) => fitness / maxFitness
    // );

    // return [...Array(populationSize)].map(
    //   () =>
    //     new Bot(
    //       startingBotPosition.x * tileSize,
    //       startingBotPosition.y * tileSize,
    //       this.levelTiles
    //     )
    // );

    // bots.sort((prev, next) => prev.getFitness() - next.getFitness()).reverse();

    // const maxFit = bots[0].getFitness();

    // bots.forEach((bot) => {
    //   bot.calculatedFitness = Math.round(bot.getFitness() / maxFit * 100);
    // });
  }
}
