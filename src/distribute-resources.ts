// https://en.wikipedia.org/wiki/Arithmetic_progression#Sum
function arithmeticSeries(
  numberOfItems: number,
  firstItem: number,
  lastItem: number
) {
  return (numberOfItems * (firstItem + lastItem)) / 2;
}

// both ints inclusive
function randomIntegerInRange(minInt: number, maxInt: number) {
  return minInt + Math.round(Math.random() * (maxInt - minInt));
}

function getTicketOwnerIndex(startingTicketRangesPerOwner: number[], ticketNumber: number): number {
  for (let ownerIndex = startingTicketRangesPerOwner.length - 1; ownerIndex >= 0; ownerIndex--) {
    if (ticketNumber > startingTicketRangesPerOwner[ownerIndex]) {
      return ownerIndex
    }
  }

  return 0
}

/** @description Function that randomly distributes `n` resources to `n` participants where first participants
  have more chance to get more resources than last participants
  @example output: distributeResources(20) ->  [1, 2, 2, 1, 2, 3, 1, 3, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0]
*/
export function distributeResources(numberOfParticipants: number) {
  const sumOfTickets = arithmeticSeries(
    numberOfParticipants,
    1,
    numberOfParticipants
  ); // arithmetic series

  const startingTicketRangesPerOwner = Array(numberOfParticipants).fill(0); // index -> index of participant, value -> lowest ticket value that belongs to them

  for (let i = 1; i < numberOfParticipants; i++) {
    startingTicketRangesPerOwner[i] = 0 + startingTicketRangesPerOwner[i - 1] + numberOfParticipants - i + 1;
  }

  const resourcesPerParticipant = Array(numberOfParticipants).fill(0); // index -> index of participant, value -> resources of that participant

  for (let i = 0; i < numberOfParticipants; i++) {
    const randomTicketNumber = randomIntegerInRange(1, sumOfTickets);
    const indexOfTicketOwner = getTicketOwnerIndex(startingTicketRangesPerOwner, randomTicketNumber);

    resourcesPerParticipant[indexOfTicketOwner]++
  }

  return resourcesPerParticipant;
}
