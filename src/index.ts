import * as PIXI from 'pixi.js';
import { productionContainer } from './di/production.config';
import { GlobalController } from './ui/controllers/GlobalController';
import { Land } from './structs/Interfaces/Land';
import { TYPES } from './di/TYPES';
import { PixiController } from './ui/controllers/PixiController';
import { Ray } from './structs/Geometry/Ray';
import { snapHexaXZ } from './structs/Geometry/Snap';

const app = new PIXI.Application({ width: 512, height: 512 });

const container = document.getElementById('renderCanvas');

container.appendChild(app.view);

app.renderer.backgroundColor = 0xcceecc;

app.renderer.view.style.position = 'absolute';
app.renderer.view.style.display = 'block';
app.renderer.resize(window.innerWidth, window.innerHeight);

app.renderer.view.style.zIndex = '0';

// add a rectange
let rectangle = new PIXI.Graphics();
rectangle.lineStyle(4, 0xff3300, 1);
rectangle.beginFill(0x66ccff);
rectangle.drawRect(0, 0, 64, 64);
rectangle.endFill();
rectangle.x = 320;
rectangle.y = 320;
app.stage.addChild(rectangle);

// add a circle
let circle = new PIXI.Graphics();
circle.lineStyle(4, 0xff3300, 1);
circle.beginFill(0x9966ff);
circle.drawCircle(0, 0, 32);
circle.endFill();
circle.x = 400;
circle.y = 320;
app.stage.addChild(circle);

// add a text
let message = new PIXI.Text('Hello Pixi!');
app.stage.addChild(message);
message.position.set(480, 480);

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

// todo key holding

const HEIGHT = (10 * Math.sqrt(3)) / 2;
const WIDTH = 10;

// draw the grid
let line = new PIXI.Graphics();
line.lineStyle(0.5, 0x000000, 0.5);
for (let i = -50; i < 50; i++) {
  line.moveTo(-50 * WIDTH, i * HEIGHT);
  line.lineTo(50 * WIDTH, i * HEIGHT);

  line.moveTo((-50 * WIDTH) / 2 + i * WIDTH, -50 * HEIGHT);
  line.lineTo((50 * WIDTH) / 2 + i * WIDTH, 50 * HEIGHT);

  line.moveTo((50 * WIDTH) / 2 + i * WIDTH, -50 * HEIGHT);
  line.lineTo((-50 * WIDTH) / 2 + i * WIDTH, 50 * HEIGHT);
}
app.stage.addChild(line);

const point = new PIXI.Graphics();
point.beginFill(0x0bef47);
point.drawCircle(0, 0, 1);
point.endFill();
point.interactive = true; // Respond to interaction
point.buttonMode = true; // The mouse changes hands
point.on('pointerdown', (event: PIXI.InteractionEvent) => {
  console.log('graphics pd');
});
point.on('pointerup', (event: PIXI.InteractionEvent) => {
  console.log('graphics pu');
});
point.on('click', (event: PIXI.InteractionEvent) => {
  console.log('graphics cl');
});
app.stage.addChild(point);

app.stage.interactive = true; // This can't be forgotten
app.stage.on('pointerdown', (event: PIXI.InteractionEvent) => {
  console.log('stage', event);

  const newCircle = new PIXI.Graphics();
  newCircle.beginFill(0x0bef47);
  newCircle.drawCircle(
    (event.data.global.x - app.stage.x) / app.stage.scale.x,
    (event.data.global.y - app.stage.y) / app.stage.scale.y,
    5
  );
  newCircle.endFill();
  app.stage.addChild(newCircle);
});

app.stage.on('pointermove', (event: PIXI.InteractionEvent) => {
  const x = (event.data.global.x - app.stage.x) / app.stage.scale.x;
  const y = (event.data.global.y - app.stage.y) / app.stage.scale.y;

  const ray = snapHexaXZ(Ray.from(x, 0, y, 0));
  point.x = ray.coord.x;
  point.y = ray.coord.z;
});

app.stage.hitArea = new PIXI.Rectangle(
  0,
  0,
  window.innerWidth,
  window.innerHeight
);

app.renderer.plugins.interaction.on(
  'pointerdown',
  (event: PIXI.InteractionEvent) => {
    // console.log('renderer', event);
  }
);

window.addEventListener('pointerdown', (event: any) => {
  // console.log('window');
});

window.addEventListener('mousewheel', (event: any) => {
  const step = event.wheelDelta > 0 ? 0.1 : -0.1;
  if (app.stage.scale.x + step >= 0.1) {
    app.stage.scale.x += step;
    app.stage.scale.y += step;
  }
});

/*
window.addEventListener('mousewheel', (event: any) => {
  const step = event.wheelDelta > 0 ? Math.PI / 18 : -Math.PI / 18;
  app.stage.rotation += step;
});
*/

/*
let id = 0;
app.ticker.add(delta => {
  console.log(id, delta);
  id++;
});
*/

window.addEventListener('DOMContentLoaded', () => {
  const specificController = new PixiController();
  const globalController = new GlobalController(specificController);
  const land = productionContainer.get<Land>(TYPES.Land);
  land.init(globalController);

  // todo global
  globalThis.stage = app.stage;
  globalThis.globalController = globalController;

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
