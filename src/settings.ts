import { level01 } from "./level-data";
import { level02 } from "./level-data/level-2";

export const startingBotPosition = { x: 3, y: 8 }; // this one should be moved to level data
export const sensorsPerBotCount = 5;
export const speed = 1;
export const distributionFunction = (participantPlace: number, numberOfParticipants: number) => (numberOfParticipants - participantPlace) ** 2
export const populationSize = 50;
export const mutationChance = 0.3;
export const maxMutationChange = 0.2;
export const activeLevel = level02;

// display settings:

export const pointOfCollisionRadius = 5;
export const tileSize = 40;

export const wallColor = "rgb(0, 160, 120)";
export const sensorLineColor = "rgb(200, 0, 0)";
export const pointOfCollisionColor = "rgb(255, 0, 0)";
export const canvasBackgroundColor = "rgb(240, 240, 240)";
export const gridLineColor = "rgb(200, 200, 200)";

export const aliveBotColor = "rgb(100, 100, 255)";
export const deadBotColor = "rgb(100, 100, 100)";
