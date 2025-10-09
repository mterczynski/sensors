// Roulette wheel selection: both ints inclusive
function randomIntegerInRange(minInt: number, maxInt: number) {
  return minInt + Math.round(Math.random() * (maxInt - minInt));
}

function getAgentIndexByTicket(
  startingTicketRangesPerAgent: number[],
  ticketNumber: number,
): number {
  for (
    let agentIndex = startingTicketRangesPerAgent.length - 1;
    agentIndex >= 0;
    agentIndex--
  ) {
    if (ticketNumber > startingTicketRangesPerAgent[agentIndex]) {
      return agentIndex;
    }
  }
  return 0;
}

/**
 * Fitness proportionate selection (roulette wheel selection) for evolutionary algorithms.
 * Randomly distributes selection slots (offspring) among agents based on their fitness.
 * @param numberOfAgents - Number of agents in the population.
 * @param fitnessFunction - Function to generate fitness (tickets) for each agent.
 * @returns Array of offspring counts per agent.
 * @example randomlyDistributeSelectionSlots(20) -> [1, 2, 2, 1, ...]
 * @example randomlyDistributeSelectionSlots(20, (i, n) => (n - i) ** 2) -> [4, 3, 3, ...]
 */
export function randomlyDistributeSelectionSlots(
  numberOfAgents: number,
  fitnessFunction = (agentIndex: number, numberOfAgents: number) =>
    numberOfAgents - agentIndex,
) {
  const ticketsPerAgent = Array(numberOfAgents)
    .fill(0)
    .map((_, agentIndex) => fitnessFunction(agentIndex, numberOfAgents));
  const sumOfTickets = ticketsPerAgent.reduce((sum, next) => sum + next, 0);

  const startingTicketRangesPerAgent = ticketsPerAgent
    .slice(0, -1)
    .reduce<number[]>((acc, next) => [...acc, next + (acc.slice(-1)[0] || 0)], [0]);
  const offspringPerAgent: number[] = Array(numberOfAgents).fill(0);

  for (let i = 0; i < numberOfAgents; i++) {
    const randomTicketNumber = randomIntegerInRange(1, sumOfTickets);
    const agentIndex = getAgentIndexByTicket(
      startingTicketRangesPerAgent,
      randomTicketNumber,
    );
    offspringPerAgent[agentIndex]++;
  }

  return offspringPerAgent;
}
