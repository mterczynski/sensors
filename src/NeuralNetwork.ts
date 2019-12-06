const inputSize = 5;
const maxWeightOffset  = 100;

function getRandomWeight() {
  return maxWeightOffset * (Math.random() * 2 - 1);
}

export class NeuralNetwork {
  private weights = [
    getRandomWeight(),
    getRandomWeight(),
    0,
    getRandomWeight(),
    getRandomWeight(),
  ];

  getWeights() {
    return [...this.weights];
  }

  evaluate(inputs: number[]) {
    if (inputs.length !== inputSize) {
      throw new Error(`Expected ${inputSize} numerical inputs`);
    }

    const sum = inputs.reduce((total, nextInput, index) => total + nextInput * this.weights[index], 0);

    return sum;
  }
}
