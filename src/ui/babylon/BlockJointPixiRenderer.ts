import * as PIXI from 'pixi.js';
import { injectable } from 'inversify';
import { BasePixiRenderer } from './BasePixiRenderer';
import { BlockJointRenderer } from '../../structs/Renderers/BlockJointRenderer';
import { PixiClick } from './PixiClick';

@injectable()
export class BlockJointPixiRenderer extends BasePixiRenderer
  implements BlockJointRenderer {
  private rectangle: PIXI.Graphics;
  private rectangle2: PIXI.Graphics;

  init(data: any) {
    this.rectangle = new PIXI.Graphics();
    this.rectangle.beginFill(0xa8a632);
    this.rectangle.drawCircle(0, -3, 3);
    this.rectangle.endFill();

    this.rectangle.x = data.ray.x;
    this.rectangle.y = data.ray.z;
    this.rectangle.rotation = -data.ray.dirXZ;
    this.rectangle.zIndex = 10;

    PixiClick(this.rectangle, 'blockjoint', data.id, 'jointA');

    ///////////////////////

    this.rectangle2 = new PIXI.Graphics();
    this.rectangle2.interactive = true;
    this.rectangle2.buttonMode = true;
    this.rectangle2.beginFill(0x470bef);
    this.rectangle2.drawCircle(0, +3, 3);
    this.rectangle2.endFill();

    this.rectangle2.x = data.ray.x;
    this.rectangle2.y = data.ray.z;
    this.rectangle2.rotation = -data.ray.dirXZ;
    this.rectangle2.zIndex = 10;

    PixiClick(this.rectangle2, 'blockjoint', data.id, 'jointB');

    globalThis.stage.addChild(this.rectangle);
    globalThis.stage.addChild(this.rectangle2);
  }

  update() { }

  remove() {
    this.rectangle.clear();
    this.rectangle.renderable = false;
    this.rectangle2.clear();
    this.rectangle2.renderable = false;
  }
}
