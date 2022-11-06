import { sensorsPerBotCount } from './settings';

const inputSize = sensorsPerBotCount;

function getRandomWeight() {
  // same chances for negative or positive number
  return Math.random() - 0.5;
}

export class NeuralNetwork {
  weights = [
    getRandomWeight(),
    getRandomWeight(),
    0,
    getRandomWeight(),
    getRandomWeight(),
  ];

  clone(): NeuralNetwork {
    const network = new NeuralNetwork();
    network.weights = [...this.weights]

    return network;
  }

  evaluate(inputs: number[]) {
    if (inputs.length !== inputSize) {
      throw new Error(`Expected ${inputSize} numerical inputs`);
    }

    const sum = inputs.reduce((total, nextInput, index) => total + nextInput * this.weights[index], 0);

    return sum;
  }
}
