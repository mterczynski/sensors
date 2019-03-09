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
    return this.weights;
  }

  evaluate(inputs: number[]): number {
    if (inputs.length != this.inputSize) {
      throw new Error(`Expected ${this.inputSize} numerical inputs`);
    }

    let sum = 0;
    inputs.forEach((input, index) => {
      sum += input * this.weights[index];
    });

    return sum;
  }
}
