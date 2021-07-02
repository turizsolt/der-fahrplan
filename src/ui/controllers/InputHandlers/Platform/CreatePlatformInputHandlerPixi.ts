import * as PIXI from 'pixi.js';
import { CreatePlatformInputHandlerPlugin } from './CreatePlatformInputHandlerPlugin';
import { Coordinate } from '../../../../structs/Geometry/Coordinate';

export class CreatePlatformInputHandlerPixi
  implements CreatePlatformInputHandlerPlugin {
  private point: PIXI.Graphics;

  init() {
    this.point = new PIXI.Graphics();
    this.point.beginFill(0x0befff);
    this.point.drawCircle(0, 0, 3);
    this.point.endFill();
    this.point.renderable = false;
    globalThis.stage.addChild(this.point);
  }

  roam(renderable: boolean, point?: Coordinate): void {
    this.point.renderable = renderable;

    if (point) {
      this.point.x = point.x;
      this.point.y = point.z;
    }
  }

  down(renderable: boolean, point?: Coordinate): void {}
  move(renderable: boolean, point?: Coordinate): void {}
  up(): void {}

  click(): void {
    this.point.renderable = false;
  }

  cancel(): void {
    this.point.renderable = false;
  }
}
