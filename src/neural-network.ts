import { sensorsPerBotCount } from './settings';

sensorsPerBotCount;

function getRandomWeight() {
  // same chances for negative or positive number
  return Math.random() - 0.5;
}

export class NeuralNetwork {
  weights = Array(sensorsPerBotCount).fill(0).map(() => getRandomWeight())

  clone(): NeuralNetwork {
    const network = new NeuralNetwork();
    network.weights = [...this.weights]

    return network;
  }

  evaluate(inputs: number[]) {
    if (inputs.length !== sensorsPerBotCount) {
      throw new Error(`Expected ${sensorsPerBotCount} numerical inputs`);
    }

    const sum = inputs.reduce((total, nextInput, index) => total + nextInput * this.weights[index], 0);

    return sum;
  }
}
