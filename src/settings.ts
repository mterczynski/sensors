import { level01 } from "./level-data";
import { level02 } from "./level-data/level-2";
import { level03 } from "./level-data/level-3";
import { level04 } from "./level-data/level-4";

export const settings = {
  simulation: {
    startingBotPosition: { x: 3, y: 8 },
    sensorsPerBotCount: 15,
    sensorAngle: 24,
    speed: 1,
    distributionFunction: (participantPlace: number, numberOfParticipants: number) => (numberOfParticipants - participantPlace) ** 2,
    populationSize: 100,
    mutationChance: 0.3,
    maxMutationChange: 0.5,
    anomaliesChance: 0.01,
    activeLevel: level04,
  },
  display: {
    pointOfCollisionRadius: 5,
    tileSize: 40,
    drawAliveBotSensors: false,
    drawDeadBotSensors: false,
    colors: {
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
        },
      },
    },
  },
};

// export the object to console, so it's tweakable during runtime
(window as any)._sensors = { settings }
