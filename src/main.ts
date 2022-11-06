import { App } from "./app";
import { distributeResources } from "./distribute-resources";

const app = new App();

distributeResources(20);
