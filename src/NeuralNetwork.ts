const inputSize = 5;

export class NeuralNetwork {
  private weights = [
    Math.random() * 200 - 100,
    Math.random() * 200 - 100,
    0,
    Math.random() * 200 - 100,
    Math.random() * 200 - 100,
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
