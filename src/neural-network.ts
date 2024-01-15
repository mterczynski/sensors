import { sensorsPerBotCount } from './settings';

type Weights = [number, number, number, number, number]

function getRandomWeight() {
  // same chances for negative or positive number
  return Math.random() - 0.5;
}

function normalizeWeights(weights: Weights): Weights {
  const maxAbs = Math.max(...(weights).map(w => Math.abs(w))) || 1

  return weights.map(weight => weight / maxAbs) as Weights
}

export class NeuralNetwork {
  weights = normalizeWeights([
    getRandomWeight(),
    getRandomWeight(),
    getRandomWeight(),
    getRandomWeight(),
    getRandomWeight()
  ])

  clone(): NeuralNetwork {
    const network = new NeuralNetwork();
    network.weights = [...this.weights]

    return network;
  }

  normalizeWeights() {
    this.weights = normalizeWeights(this.weights)
  }

  evaluate(inputs: number[]) {
    if (inputs.length !== sensorsPerBotCount) {
      throw new Error(`Expected ${sensorsPerBotCount} numerical inputs`);
    }

    const sum = inputs.reduce((total, nextInput, index) => total + nextInput * this.weights[index], 0);

    return sum;
  }
}
