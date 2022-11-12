import { level01 } from "./level-data";
import { level02 } from "./level-data/level-2";

export const startingBotPosition = { x: 3, y: 8 }; // this one should be moved to level data
export const sensorsPerBotCount = 5;
export const speed = 1;
export const distributionFunction = (participantPlace: number, numberOfParticipants: number) => (numberOfParticipants - participantPlace) ** 2
export const populationSize = 200;
export const mutationChance = 0.3;
export const maxMutationChange = 0.5;
export const anomaliesChance = 0.01; // anomaly = bot with totally random neural network
export const activeLevel = level02;

// display settings:

export const pointOfCollisionRadius = 5;
export const tileSize = 40;

export const drawSensors = false;

export const colors = {
  wall: "rgb(0, 160, 120)",
  sensorLine: "rgba(200, 0, 0, 0.3)",
  pointOfCollision: "rgba(255, 0, 0, 0.2)",
  canvasBackground: "rgb(240, 240, 240)",
  gridLine: "rgb(200, 200, 200)",

  bots: {
    normal: {
      aliveBot: "rgb(100, 100, 255)",
      deadBot: "rgb(100, 100, 100)",
    },
    anomaly: {
      aliveBot: "rgb(100, 190, 100)",
      deadBot: "rgb(50, 80, 50)",
    }
  }
}


