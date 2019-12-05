export class NeuralNetwork {
  readonly inputSize = 5;

  private weights = [
    Math.random() * 200 - 100,
    Math.random() * 200 - 100,
    0,
    Math.random() * 200 - 100,
    Math.random() * 200 - 100
  ]

  getWeights() {
    return [...this.weights];
  }

  evaluate(inputs: number[]): number {
    if (inputs.length != this.inputSize) {
      throw new Error(`Expected ${this.inputSize} numerical inputs`);
    }

    let sum = inputs.reduce((total, nextInput, index) => total + nextInput * this.weights[index], 0);

    return sum;
  }
}
