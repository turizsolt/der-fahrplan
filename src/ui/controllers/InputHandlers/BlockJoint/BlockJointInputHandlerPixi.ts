import * as PIXI from 'pixi.js';
import { Coordinate } from '../../../../structs/Geometry/Coordinate';
import { BlockJointInputHandlerPlugin } from './BlockJointInputHandlerPlugin';

export class BlockJointInputHandlerPixi
  implements BlockJointInputHandlerPlugin {
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

  click() {
    this.point.renderable = false;
  }

  cancel() {
    this.point.renderable = false;
  }
}
