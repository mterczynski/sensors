import { settings } from "./settings";

function getRandomWeight() {
  // same chances for negative or positive number
  return Math.random() - 0.5;
}

function normalizeWeights(weights: number[]): number[] {
  const maxAbs = Math.max(...(weights).map(w => Math.abs(w))) || 1

  return weights.map(weight => weight / maxAbs)
}

export class NeuralNetwork {
  weights = normalizeWeights([...Array(settings.simulation.sensorsPerBotCount)].map(e => getRandomWeight()))

  clone(): NeuralNetwork {
    const network = new NeuralNetwork();
    network.weights = [...this.weights]

    return network;
  }

  normalizeWeights() {
    this.weights = normalizeWeights(this.weights)
  }

  evaluate(inputs: number[]) {
    if (inputs.length !== settings.simulation.sensorsPerBotCount) {
      throw new Error(`Expected ${settings.simulation.sensorsPerBotCount} numerical inputs`);
    }

    const sum = inputs.reduce((total, nextInput, index) => total + nextInput * this.weights[index], 0);

    return sum;
  }
}
