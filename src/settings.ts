import { level01 } from "./level-data";
import { level02 } from "./level-data/level-2";
import { level03 } from "./level-data/level-3";
import { level04 } from "./level-data/level-4";

export const settings = {
  simulation: {
    /** Number of sensors per bot */
    sensorsPerBotCount: 15,
    /** Angle between each sensor (degrees) */
    sensorAngle: 24,
    /** Simulation speed multiplier - higher = faster */
    speed: 1,
    /** Function to distribute fitness among bots */
    distributionFunction: (
      participantPlace: number,
      numberOfParticipants: number,
    ) => (numberOfParticipants - participantPlace) ** 2,
    /** Number of bots in the population */
    populationSize: 100,
    /** Probability of mutation per bot */
    mutationChance: 0.3,
    /** Maximum change allowed per mutation */
    maxMutationChange: 0.5,
    /** Chance for a bot to be an anomaly (anomalies use different colors and have fresh new, untrained neural networks) */
    anomaliesChance: 0.01,
    /** Currently active level data */
    activeLevel: level04,
  },
  display: {
    pointOfCollisionRadius: 5,
    tileSize: 40,
    drawAliveBotSensors: true,
    drawDeadBotSensors: false,
    // maximum number of bots with drawn sensors:
    maxBotsWithDrawnSensors: 1,
    colors: {
      wall: "rgb(0, 160, 120)",
      sensorLine: {
        positive: "200, 0, 0",
        negative: "0, 0, 200",
        alphaAffectedByWeight: true,
      },
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
        },
      },
    },
  },
};

// export the object to console, so it's tweakable during runtime
(window as any)._sensors = { settings };
