import { sensorsPerBotCount } from './settings';

const inputSize = sensorsPerBotCount;

function getRandomWeight() {
  // same chances for negative or positive number
  return Math.random() - 0.5;
}

export class NeuralNetwork {
  private weights = [
    getRandomWeight(),
    getRandomWeight(),
    0,
    getRandomWeight(),
    getRandomWeight(),
  ];

  evaluate(inputs: number[]) {
    if (inputs.length !== inputSize) {
      throw new Error(`Expected ${inputSize} numerical inputs`);
    }

    const sum = inputs.reduce((total, nextInput, index) => total + nextInput * this.weights[index], 0);

    return sum;
  }
}
