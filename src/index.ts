import * as PIXI from 'pixi.js';

const app = new PIXI.Application({ width: 512, height: 512 });

const container = document.getElementById('renderCanvas');

container.appendChild(app.view);

app.renderer.backgroundColor = 0xcceecc;

app.renderer.view.style.position = 'absolute';
app.renderer.view.style.display = 'block';
app.renderer.resize(window.innerWidth, window.innerHeight);

app.renderer.view.style.zIndex = '5'; // '-1';

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

const point = new PIXI.Graphics();
point.beginFill(0x0bef47);
point.drawCircle(300, 300, 50);
point.endFill();
point.interactive = true; // Respond to interaction
point.buttonMode = true; // The mouse changes hands
point.on('pointerdown', (event: PIXI.InteractionEvent) => {
  console.log('graphics');
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

app.stage.hitArea = new PIXI.Rectangle(
  0,
  0,
  window.innerWidth,
  window.innerHeight
);

app.renderer.plugins.interaction.on(
  'pointerdown',
  (event: PIXI.InteractionEvent) => {
    console.log('renderer', event);
  }
);

window.addEventListener('pointerdown', (event: any) => {
  console.log('window');
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
