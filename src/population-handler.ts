import { Bot } from "./bot";
import { distributeResources } from "./distribute-resources";
import { Tile } from "./level-data/level-data.types";
import { maxMutationChange, mutationChance, populationSize, startingBotPosition, tileSize } from "./settings";

function formatWeights(weights: number[]) {
  return weights.map((weight: number) => Math.round(weight * 100) / 100)
}

export class PopulationHandler {
  constructor(private levelTiles: Tile[]) { }

  getNewGeneration(bots: Bot[]): Bot[] {
    // todo - calculate bots fitnesses, generate new bots from their parents genes

    var weightsAll: any[] = []

    const botsOrderedByFitness = [...bots].sort((prev, next) => next.getFitness() - prev.getFitness());
    const offspringPerBot = distributeResources(bots.length);
    const newGenUnflatted = Array(bots.length).fill(0).map((_, botIndex) => {
      const parent: Bot = botsOrderedByFitness[botIndex];
      return Array(offspringPerBot[botIndex]).fill(null).map(() => {
        const neuralNetwork = parent.neuralNetwork.clone()

        neuralNetwork.weights[0] += mutationChance > Math.random() ? maxMutationChange * (Math.random() - 0.5) : 0
        neuralNetwork.weights[1] += mutationChance > Math.random() ? maxMutationChange * (Math.random() - 0.5) : 0
        neuralNetwork.weights[3] += mutationChance > Math.random() ? maxMutationChange * (Math.random() - 0.5) : 0
        neuralNetwork.weights[4] += mutationChance > Math.random() ? maxMutationChange * (Math.random() - 0.5) : 0

        const child = new Bot(
          startingBotPosition.x * tileSize,
          startingBotPosition.y * tileSize,
          this.levelTiles,
          neuralNetwork
        )

        weightsAll.push(neuralNetwork.weights)

        return child;
      })
    })

    console.log(JSON.stringify(
      weightsAll
        .slice(0, 5)
        .map(weights => formatWeights(weights))
    ))

    var weightsSum = weightsAll.slice(1).reduce((acc, nextBotWeights) => {
      return [
        acc[0] + nextBotWeights[0],
        acc[1] + nextBotWeights[1],
        acc[2] + nextBotWeights[2],
        acc[3] + nextBotWeights[3],
        acc[4] + nextBotWeights[4],
      ]
    }, weightsAll[0]
    );

    var weightsAvg = weightsSum.map((weightSum: number) => weightSum / bots.length)

    console.log('avg', formatWeights(weightsAvg))

    var newGen = newGenUnflatted.flat()

    return newGen
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
