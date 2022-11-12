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
  @example output: distributeResources(20)) ->  [1, 2, 2, 1, 2, 3, 1, 3, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0]
  @example output: distributeResources(20, (p, n) => (n - p) ** 2)) ->  [4, 3, 3, 3, 1, 0, 2, 0, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
*/
export function randomlyDistributeResources(
  numberOfParticipants: number,
  /** A function for generating tickets depending on number participant - this function dictates equality/inequality of distribution */
  ticketGenerator = (participantPlace: number, numberOfParticipants: number) => numberOfParticipants - participantPlace
) {
  const ticketsPerParticipant = Array(numberOfParticipants).fill(0).map((_, participantPlace) => ticketGenerator(participantPlace, numberOfParticipants))
  const sumOfTickets = ticketsPerParticipant.reduce((sum, nextParticipantTickets) => sum + nextParticipantTickets, 0)

  const startingTicketRangesPerOwner = ticketsPerParticipant
    .slice(0, -1)
    .reduce<number[]>((acc, next) => [...acc, next + (acc.slice(-1)[0] || 0)], [0])
  const resourcesPerParticipant: number[] = Array(numberOfParticipants).fill(0); // index -> place of participant, value -> resources of that participant

  for (let i = 0; i < numberOfParticipants; i++) {
    const randomTicketNumber = randomIntegerInRange(1, sumOfTickets);
    const indexOfTicketOwner = getTicketOwnerIndex(startingTicketRangesPerOwner, randomTicketNumber);

    resourcesPerParticipant[indexOfTicketOwner]++
  }

  return resourcesPerParticipant;
}
