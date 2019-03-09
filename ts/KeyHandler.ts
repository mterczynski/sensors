export class KeyHandler {
  pressedKeys: any = {}
  constructor() {
    this.addKeyListeners();
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
