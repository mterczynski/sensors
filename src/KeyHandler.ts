const pressedKeys: {[key: string]: boolean} = {};

let isListening = false;

export const keyHandler  = {
  getPressedKeys() {
    return {...pressedKeys};
  },

  addKeyListeners() {
    if (isListening) {
      return;
    }

    document.addEventListener('keydown', (e) => {
      pressedKeys[e.key.toLowerCase()] = true;
    });

    document.addEventListener('keyup', (e) => {
      pressedKeys[e.key.toLowerCase()] = false;
    });

    isListening = true;
  },
};
