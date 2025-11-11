import { App } from "./app";
import { SettingsGUI } from "./settings-gui";

const app = new App();
app.init();

// Initialize settings GUI with callback to reset simulation on settings change
new SettingsGUI(() => {
  app.resetSimulation();
});
