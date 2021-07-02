import * as PIXI from 'pixi.js';
import { CreateStationInputHandlerPlugin } from './CreateStationInputHandlerPlugin';
import { Coordinate } from '../../../../structs/Geometry/Coordinate';

export class CreateStationInputHandlerPixi
  implements CreateStationInputHandlerPlugin {
  private fromPoint: PIXI.Graphics;
  private toPoint: PIXI.Graphics;

  init() {
    this.fromPoint = new PIXI.Graphics();
    this.fromPoint.beginFill(0x0befff);
    this.fromPoint.drawCircle(0, 0, 3);
    this.fromPoint.endFill();
    this.fromPoint.renderable = false;
    globalThis.stage.addChild(this.fromPoint);

    this.toPoint = new PIXI.Graphics();
    this.toPoint.beginFill(0x0befff);
    this.toPoint.drawCircle(0, 0, 3);
    this.toPoint.endFill();
    this.toPoint.renderable = false;
    globalThis.stage.addChild(this.toPoint);
  }

  setFrom(renderable: boolean, point?: Coordinate): void {
    this.fromPoint.renderable = renderable;

    if (point) {
      this.fromPoint.x = point.x;
      this.fromPoint.y = point.z;
    }
  }

  setTo(renderable: boolean, point?: Coordinate): void {
    this.toPoint.renderable = renderable;

    if (point) {
      this.toPoint.x = point.x;
      this.toPoint.y = point.z;
    }
  }

  up(): void {
    this.cancel();
  }

  click(): void {
    this.cancel();
  }

  cancel(): void {
    this.fromPoint.renderable = false;
    this.toPoint.renderable = false;
  }
}
