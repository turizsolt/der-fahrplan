import * as PIXI from 'pixi.js';
import { productionContainer } from './di/production.config';
import { GlobalController } from './ui/controllers/GlobalController';
import { Land } from './structs/Interfaces/Land';
import { TYPES } from './di/TYPES';
import { PixiController } from './ui/controllers/PixiController';

// init PIXI
const app = new PIXI.Application({ width: 512, height: 512 });
document.getElementById('renderCanvas').appendChild(app.view);
app.renderer.backgroundColor = 0xcceecc;
app.renderer.view.style.position = 'absolute';
app.renderer.view.style.display = 'block';
app.renderer.resize(window.innerWidth, window.innerHeight);
app.renderer.view.style.zIndex = '0';

// todo keyboard - should be removed
function keyboard(value) {
  let key: any = {};
  key.value = value;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = event => {
    if (event.key === key.value) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
      event.preventDefault();
    }
  };

  //The `upHandler`
  key.upHandler = event => {
    if (event.key === key.value) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
      event.preventDefault();
    }
  };

  //Attach event listeners
  const downListener = key.downHandler.bind(key);
  const upListener = key.upHandler.bind(key);

  window.addEventListener('keydown', downListener, false);
  window.addEventListener('keyup', upListener, false);

  // Detach event listeners
  key.unsubscribe = () => {
    window.removeEventListener('keydown', downListener);
    window.removeEventListener('keyup', upListener);
  };

  return key;
}

let keyDown = keyboard('ArrowDown');
let keyUp = keyboard('ArrowUp');
let keyLeft = keyboard('ArrowLeft');
let keyRight = keyboard('ArrowRight');
let keyQ = keyboard('q');
let keyA = keyboard('a');

keyDown.press = () => {
  app.stage.y += 50;
};

keyUp.press = () => {
  app.stage.y -= 50;
};

keyRight.press = () => {
  app.stage.x += 50;
};

keyLeft.press = () => {
  app.stage.x -= 50;
};

keyQ.press = () => {
  const step = 0.5;
  if (app.stage.scale.x + step >= 0.5) {
    app.stage.scale.x += step;
    app.stage.scale.y += step;
  }
};

keyA.press = () => {
  const step = -0.5;
  if (app.stage.scale.x + step >= 0.5) {
    app.stage.scale.x += step;
    app.stage.scale.y += step;
  }
};

// draw the grid
const HEIGHT = (10 * Math.sqrt(3)) / 2;
const WIDTH = 10;

let line = new PIXI.Graphics();
line.lineStyle(0.25, 0x000000, 0.25);
for (let i = -50; i < 50; i++) {
  line.moveTo(-50 * WIDTH, i * HEIGHT);
  line.lineTo(50 * WIDTH, i * HEIGHT);

  line.moveTo((-50 * WIDTH) / 2 + i * WIDTH, -50 * HEIGHT);
  line.lineTo((50 * WIDTH) / 2 + i * WIDTH, 50 * HEIGHT);

  line.moveTo((50 * WIDTH) / 2 + i * WIDTH, -50 * HEIGHT);
  line.lineTo((-50 * WIDTH) / 2 + i * WIDTH, 50 * HEIGHT);
}
app.stage.scale.x = 3;
app.stage.scale.y = 3;
app.stage.addChild(line);
// todo global
globalThis.stage = app.stage;

// listeners
window.addEventListener('DOMContentLoaded', () => {
  const specificController = new PixiController();
  const globalController = new GlobalController(specificController);
  const land = productionContainer.get<Land>(TYPES.Land);
  land.init(globalController);

  // todo global
  globalThis.globalController = globalController;

  app.stage.on('pointerdown', (event: PIXI.InteractionEvent) => {
    const x = (event.data.global.x - app.stage.x) / app.stage.scale.x;
    const y = (event.data.global.y - app.stage.y) / app.stage.scale.y;
    event.data.global.x = x;
    event.data.global.y = y;
    globalController.down({ ...event, button: event.data.button } as any);
  });

  app.stage.on('pointerup', (event: PIXI.InteractionEvent) => {
    const x = (event.data.global.x - app.stage.x) / app.stage.scale.x;
    const y = (event.data.global.y - app.stage.y) / app.stage.scale.y;
    event.data.global.x = x;
    event.data.global.y = y;
    globalController.up({ ...event, button: event.data.button } as any);
  });

  app.stage.on('pointermove', (event: PIXI.InteractionEvent) => {
    const x = (event.data.global.x - app.stage.x) / app.stage.scale.x;
    const y = (event.data.global.y - app.stage.y) / app.stage.scale.y;
    event.data.global.x = x;
    event.data.global.y = y;
    globalController.move({ ...event, button: event.data.button } as any);
  });

  app.stage.interactive = true; // This can't be forgotten
  app.stage.sortableChildren = true;

  app.stage.hitArea = new PIXI.Rectangle(
    -500,
    -500,
    1000, // window.innerWidth,
    1000 // window.innerHeight
  );

  window.addEventListener('mousewheel', (event: any) => {
    globalController.wheel(event);
  });

  document.addEventListener('contextmenu', e => {
    e.preventDefault();
    return false;
  });
  document.addEventListener(
    'dragover',
    function(event) {
      event.preventDefault();
    },
    false
  );

  document.addEventListener(
    'drop',
    function(event) {
      // cancel default actions
      event.preventDefault();

      var i = 0,
        files = event && event.dataTransfer && event.dataTransfer.files,
        len = (files && files.length) || 0;

      for (; i < len; i++) {
        var reader = new FileReader();
        reader.onload = function(event) {
          var contents = (event.target as any).result;

          try {
            const obj = JSON.parse(contents);

            if (!obj._version) throw new Error();
            if (obj._version != 2) throw new Error();
            if (!obj._format || obj._format !== 'fahrplan') throw new Error();
            globalController.load(obj.data);
            globalController.loadSpecific(obj);
          } catch {
            console.error('Not proper JSON, hey!');
          }
        };

        reader.onerror = function(event) {
          console.error(
            'File could not be read! Code ' + (event.target as any).error.code
          );
        };

        if (files) reader.readAsText(files[i]);
      }
    },
    false
  );
});
