import { randomlyDistributeSelectionSlots } from "./randomly-distribute-resources";
import { Tile } from "./level-data/level-data.types";
import { NeuralNetwork } from "./neural-network";
import { Bot } from "./Bot";
import { settings } from "./settings";
import _ from "lodash";

function formatWeights(weights: number[]) {
  return weights.map((weight: number) => Math.round(weight * 100) / 100);
}

/**
 * Handles population management for evolutionary algorithms.
 * Generates a new generation of agents (bots) using fitness proportionate selection and mutation.
 */
export class PopulationHandler {
  constructor(private levelTiles: Tile[]) {}

  getNewGeneration(bots: Bot[]): Bot[] {
    const weightsAll: any[] = [];

    const botsOrderedByFitness = [...bots].sort(
      (prev, next) => next.getFitness() - prev.getFitness(),
    );
    const offspringPerAgent = randomlyDistributeSelectionSlots(
      bots.length,
      settings.simulation.distributionFunction,
    );
    const newGeneration = Array(bots.length)
      .fill(0)
      .map((bot, botIndex) => {
        const parent: Bot = botsOrderedByFitness[botIndex];
        return Array(offspringPerAgent[botIndex])
          .fill(null)
          .map(() => {
            let neuralNetwork = parent.neuralNetwork.clone();

            const isAnomaly =
              Math.random() < settings.simulation.anomaliesChance;

            if (isAnomaly) {
              neuralNetwork = new NeuralNetwork();
            } else {
              for (let i = 0; i < settings.simulation.sensorsPerBotCount; i++) {
                // Apply mutation to weights
                neuralNetwork.weights[i] +=
                  settings.simulation.mutationChance > Math.random()
                    ? settings.simulation.maxMutationChange *
                      (Math.random() - 0.5)
                    : 0;
              }
            }

            neuralNetwork.normalizeWeights();

            const startingBotPosition = _.sample(
              settings.simulation.activeLevel.startingBotPositions,
            )!;

            const child = new Bot(
              startingBotPosition.x * settings.display.tileSize,
              startingBotPosition.y * settings.display.tileSize,
              this.levelTiles,
              isAnomaly,
              neuralNetwork,
            );

            child.setRotation(startingBotPosition.direction);

            weightsAll.push(neuralNetwork.weights);

            return child;
          });
      })
      .flat();

    const weightsSum = weightsAll.slice(1).reduce((acc, nextBotWeights) => {
      return Array(settings.simulation.sensorsPerBotCount)
        .fill(0)
        .map((_, index) => {
          return acc[index] + nextBotWeights[index];
        });
    }, weightsAll[0]);

    const weightsAvg = weightsSum.map(
      (weightSum: number) => weightSum / bots.length,
    );

    console.log(
      "avg",
      formatWeights(weightsAvg),
      "\ntop 1",
      formatWeights(botsOrderedByFitness[0].neuralNetwork.weights),
    );

    return newGeneration;
  }
}
