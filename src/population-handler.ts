import { randomlyDistributeResources } from "./randomly-distribute-resources";
import { Tile } from "./level-data/level-data.types";
import { NeuralNetwork } from "./neural-network";
import { Bot } from "./Bot";
import { settings } from "./settings";
import _ from 'lodash';

function formatWeights(weights: number[]) {
  return weights.map((weight: number) => Math.round(weight * 100) / 100)
}

export class PopulationHandler {
  constructor(private levelTiles: Tile[]) { }

  getNewGeneration(bots: Bot[]): Bot[] {
    const weightsAll: any[] = []

    const botsOrderedByFitness = [...bots].sort((prev, next) => next.getFitness() - prev.getFitness());
    const offspringPerBot = randomlyDistributeResources(bots.length, settings.simulation.distributionFunction);
    const newGeneration = Array(bots.length).fill(0).map((bot, botIndex) => {
      const parent: Bot = botsOrderedByFitness[botIndex];
      return Array(offspringPerBot[botIndex]).fill(null).map(() => {
        let neuralNetwork = parent.neuralNetwork.clone()

        const isAnomaly = Math.random() < settings.simulation.anomaliesChance

        if (isAnomaly) {
          neuralNetwork = new NeuralNetwork()
        } else {
          for (let i = 0; i < settings.simulation.sensorsPerBotCount; i++) {
            neuralNetwork.weights[i] += settings.simulation.mutationChance > Math.random() ?
              settings.simulation.maxMutationChange * (Math.random() - 0.5) : 0
          }
        }

        neuralNetwork.normalizeWeights()

        const startingBotPosition = _.sample(settings.simulation.activeLevel.startingBotPositions)!

        const child = new Bot(
          startingBotPosition.x * settings.display.tileSize,
          startingBotPosition.y * settings.display.tileSize,
          this.levelTiles,
          isAnomaly,
          neuralNetwork
        )

        child.setRotation(startingBotPosition.direction)

        // neuralNetwork.weights[2] = 0

        weightsAll.push(neuralNetwork.weights)

        return child;
      })
    }).flat()

    const weightsSum = weightsAll.slice(1).reduce((acc, nextBotWeights) => {
      return Array(settings.simulation.sensorsPerBotCount).fill(0).map((_, index) => {
        return acc[index] + nextBotWeights[index]
      })
    }, weightsAll[0]
    );

    const weightsAvg = weightsSum.map((weightSum: number) => weightSum / bots.length)

    console.log('avg', formatWeights(weightsAvg), '\ntop 1', formatWeights(botsOrderedByFitness[0].neuralNetwork.weights))

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
