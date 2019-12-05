export class KeyHandler {
  private _pressedKeys: {[key: string]: boolean} = {}

  constructor() {
    this.addKeyListeners();
  }

  get pressedKeys() {
    return {...this._pressedKeys};
  }

  addKeyListeners() {
    document.addEventListener('keydown', (e) => {
      this.pressedKeys[e.key.toLowerCase()] = true
    });

    document.addEventListener('keyup', (e) => {
      this.pressedKeys[e.key.toLowerCase()] = false
    });
  }
}
