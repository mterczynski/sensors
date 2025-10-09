import { settings } from "./settings";

/** Returns a random weight for neural network initialization
 * with the same chances for positive and negative values*/
function getRandomWeight() {
  return Math.random() - 0.5;
}

function normalizeWeights(weights: number[]): number[] {
  const maxAbs = Math.max(...weights.map((w) => Math.abs(w))) || 1;
  return weights.map((weight) => weight / maxAbs);
}

/**
 * Simple feedforward neural network for agent decision making.
 * Weights are mutated during evolutionary updates.
 */
export class NeuralNetwork {
  weights = normalizeWeights(
    [...Array(settings.simulation.sensorsPerBotCount)].map(() =>
      getRandomWeight(),
    ),
  );

  /**
   * Returns a deep copy of this neural network.
   */
  clone(): NeuralNetwork {
    const network = new NeuralNetwork();
    network.weights = [...this.weights];
    return network;
  }

  /**
   * Normalizes the weights to keep them within a reasonable range.
   */
  normalizeWeights() {
    this.weights = normalizeWeights(this.weights);
  }

  /**
   * Evaluates the neural network output given sensor inputs.
   * @param inputs - Array of sensor values.
   * @returns Weighted sum of inputs.
   */
  evaluate(inputs: number[]) {
    if (inputs.length !== settings.simulation.sensorsPerBotCount) {
      throw new Error(
        `NeuralNetwork.evaluate: Expected ${settings.simulation.sensorsPerBotCount} numerical inputs`,
      );
    }
    const sum = inputs.reduce(
      (total, nextInput, index) => total + nextInput * this.weights[index],
      0,
    );
    return sum;
  }
}
