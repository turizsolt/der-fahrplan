import * as PIXI from 'pixi.js';
import { injectable } from 'inversify';
import { BasePixiRenderer } from './BasePixiRenderer';
import { TrackJointRenderer } from '../../structs/Renderers/TrackJointRenderer';
import { PixiClick } from './PixiClick';

@injectable()
export class TrackJointPixiRenderer extends BasePixiRenderer
  implements TrackJointRenderer {
  private rectangle: PIXI.Graphics;
  private rectangle2: PIXI.Graphics;

  init(data: any) {
    this.rectangle = new PIXI.Graphics();
    this.rectangle.beginFill(0xa8a632);
    this.rectangle.drawRect(-0.5, -1.5, 1, 1.5);
    this.rectangle.endFill();

    this.rectangle.x = data.ray.x;
    this.rectangle.y = data.ray.z;
    this.rectangle.rotation = -data.ray.dirXZ;
    this.rectangle.zIndex = 1;

    PixiClick(this.rectangle, 'trackjoint', data.id);

    ///////////////////////

    this.rectangle2 = new PIXI.Graphics();
    this.rectangle2.beginFill(0x470bef);
    this.rectangle2.drawRect(-0.5, 0, 1, 1.5);
    this.rectangle2.endFill();

    this.rectangle2.x = data.ray.x;
    this.rectangle2.y = data.ray.z;
    this.rectangle2.rotation = -data.ray.dirXZ;
    this.rectangle2.zIndex = 1;

    PixiClick(this.rectangle2, 'trackjoint', data.id);

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
