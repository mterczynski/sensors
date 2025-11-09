import * as dat from "dat.gui";
import { settings } from "./settings";

const STORAGE_PREFIX = "mter_sensors_ai_";

interface SettingsChangeCallback {
  (): void;
}

export class SettingsGUI {
  private gui: dat.GUI;
  private onSettingsChange: SettingsChangeCallback;

  constructor(onSettingsChange: SettingsChangeCallback) {
    this.onSettingsChange = onSettingsChange;
    this.gui = new dat.GUI();
    this.loadSettings();
    this.setupGUI();
  }

  private loadSettings() {
    // Load settings from localStorage
    const keys = Object.keys(localStorage);
    keys
      .filter((key) => key.startsWith(STORAGE_PREFIX))
      .forEach((key) => {
        const settingPath = key.replace(STORAGE_PREFIX, "");
        const value = localStorage.getItem(key);
        if (value !== null) {
          this.setNestedValue(settings, settingPath, JSON.parse(value));
        }
      });
  }

  private setNestedValue(obj: any, path: string, value: any) {
    const keys = path.split(".");
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
  }

  private saveToLocalStorage(path: string, value: any) {
    localStorage.setItem(STORAGE_PREFIX + path, JSON.stringify(value));
  }

  private setupGUI() {
    // Simulation folder
    const simulationFolder = this.gui.addFolder("Simulation");

    simulationFolder
      .add(settings.simulation, "sensorsPerBotCount", 3, 50, 1)
      .name("Sensors per Bot")
      .onChange((value) => {
        this.saveToLocalStorage("simulation.sensorsPerBotCount", value);
        this.onSettingsChange();
      });

    simulationFolder
      .add(settings.simulation, "sensorAngle", 5, 180, 1)
      .name("Sensor Angle")
      .onChange((value) => {
        this.saveToLocalStorage("simulation.sensorAngle", value);
        this.onSettingsChange();
      });

    simulationFolder
      .add(settings.simulation, "speed", 0.1, 5, 0.1)
      .name("Speed")
      .onChange((value) => {
        this.saveToLocalStorage("simulation.speed", value);
        // Don't reset simulation on speed change
      });

    simulationFolder
      .add(settings.simulation, "populationSize", 10, 500, 10)
      .name("Population Size")
      .onChange((value) => {
        this.saveToLocalStorage("simulation.populationSize", value);
        this.onSettingsChange();
      });

    simulationFolder
      .add(settings.simulation, "mutationChance", 0, 1, 0.01)
      .name("Mutation Chance")
      .onChange((value) => {
        this.saveToLocalStorage("simulation.mutationChance", value);
        // Don't reset simulation - affects future generations only
      });

    simulationFolder
      .add(settings.simulation, "maxMutationChange", 0, 2, 0.05)
      .name("Max Mutation Change")
      .onChange((value) => {
        this.saveToLocalStorage("simulation.maxMutationChange", value);
        // Don't reset simulation - affects future generations only
      });

    simulationFolder
      .add(settings.simulation, "anomaliesChance", 0, 0.5, 0.01)
      .name("Anomalies Chance")
      .onChange((value) => {
        this.saveToLocalStorage("simulation.anomaliesChance", value);
        // Don't reset simulation - affects future generations only
      });

    simulationFolder.open();

    // Display folder
    const displayFolder = this.gui.addFolder("Display");

    displayFolder
      .add(settings.display, "drawAliveBotSensors")
      .name("Draw Alive Bot Sensors")
      .onChange((value) => {
        this.saveToLocalStorage("display.drawAliveBotSensors", value);
      });

    displayFolder
      .add(settings.display, "drawDeadBotSensors")
      .name("Draw Dead Bot Sensors")
      .onChange((value) => {
        this.saveToLocalStorage("display.drawDeadBotSensors", value);
      });

    displayFolder
      .add(settings.display, "maxBotsWithDrawnSensors", 0, 20, 1)
      .name("Max Bots with Sensors")
      .onChange((value) => {
        this.saveToLocalStorage("display.maxBotsWithDrawnSensors", value);
      });

    displayFolder
      .add(settings.display.colors.sensorLine, "alphaAffectedByWeight")
      .name("Alpha by Weight")
      .onChange((value) => {
        this.saveToLocalStorage(
          "display.colors.sensorLine.alphaAffectedByWeight",
          value,
        );
      });

    // Reset button
    this.gui
      .add(
        {
          resetSettings: () => {
            this.resetSettings();
          },
        },
        "resetSettings",
      )
      .name("Reset All Settings");
  }

  private resetSettings() {
    // Clear all localStorage items with our prefix
    const keys = Object.keys(localStorage);
    keys
      .filter((key) => key.startsWith(STORAGE_PREFIX))
      .forEach((key) => localStorage.removeItem(key));

    // Reload the page to get default settings
    window.location.reload();
  }

  destroy() {
    this.gui.destroy();
  }
}
