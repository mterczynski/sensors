export class HelpPopup {
  private overlay!: HTMLDivElement;
  private popup!: HTMLDivElement;
  private button!: HTMLButtonElement;

  constructor() {
    this.createButton();
    this.createPopup();
    this.attachEventListeners();
  }

  private createButton() {
    this.button = document.createElement("button");
    this.button.id = "help-button";
    this.button.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="2"/>
        <text x="10" y="15" text-anchor="middle" font-size="14" font-weight="bold" fill="currentColor">?</text>
      </svg>
      <span>Help</span>
    `;
    document.body.appendChild(this.button);
  }

  private createPopup() {
    // Create overlay
    this.overlay = document.createElement("div");
    this.overlay.id = "help-overlay";
    this.overlay.style.display = "none";

    // Create popup
    this.popup = document.createElement("div");
    this.popup.id = "help-popup";

    this.popup.innerHTML = `
      <div class="help-popup-header">
        <h2>About This Project</h2>
        <button id="help-close" aria-label="Close">&times;</button>
      </div>
      <div class="help-popup-content">
        <section>
          <h3>Description</h3>
          <p>
            This project demonstrates <strong>evolutionary learning</strong> where AI agents (bots) 
            learn to navigate through maze-like environments without hitting walls.
          </p>
        </section>

        <section>
          <h3>The Problem</h3>
          <p>
            Bots are placed in a level with walls and must survive as long as possible by avoiding collisions. 
            Each bot has:
          </p>
          <ul>
            <li>Multiple <strong>sensors</strong> that detect distance to the nearest wall</li>
            <li>A simple <strong>neural network</strong> that processes sensor inputs to decide turning direction</li>
          </ul>
        </section>

        <section>
          <h3>Learning Methods</h3>
          
          <h4>1. Neural Networks</h4>
          <ul>
            <li>Each bot has a neural network with weights that determine how sensor inputs affect movement</li>
            <li><strong>Network inputs:</strong> distance readings from each sensor</li>
            <li><strong>Network output:</strong> turning direction (left or right)</li>
          </ul>

          <h4>2. Evolutionary Algorithm (Genetic Algorithm)</h4>
          <ul>
            <li>Population of bots compete each generation</li>
            <li>Fitness is measured by survival time</li>
            <li>Successful bots produce more offspring for the next generation</li>
            <li>Offspring inherit parent's neural network weights with small mutations</li>
            <li>Random anomalies introduce fresh neural networks to prevent local optima</li>
          </ul>

          <h4>3. Mutation & Selection</h4>
          <ul>
            <li>Better-performing bots get more offspring (fitness-proportional selection)</li>
            <li>Offspring weights are slightly mutated to explore new behaviors</li>
            <li>Over generations, bots evolve better wall-avoidance strategies</li>
          </ul>
        </section>

        <section>
          <h3>Controls</h3>
          <p>Use the settings panel on the right to adjust:</p>
          <ul>
            <li><strong>Simulation parameters:</strong> sensors, speed, population size, mutation rates</li>
            <li><strong>Display options:</strong> sensor visualization, bot drawing options</li>
          </ul>
          <p>Settings are automatically saved to your browser's local storage.</p>
        </section>
      </div>
    `;

    this.overlay.appendChild(this.popup);
    document.body.appendChild(this.overlay);
  }

  private attachEventListeners() {
    // Open popup
    this.button.addEventListener("click", () => this.open());

    // Close popup - close button
    const closeBtn = this.popup.querySelector("#help-close") as HTMLButtonElement;
    closeBtn.addEventListener("click", () => this.close());

    // Close popup - clicking overlay
    this.overlay.addEventListener("click", (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });

    // Close popup - ESC key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.overlay.style.display === "flex") {
        this.close();
      }
    });
  }

  private open() {
    this.overlay.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  private close() {
    this.overlay.style.display = "none";
    document.body.style.overflow = "";
  }
}
