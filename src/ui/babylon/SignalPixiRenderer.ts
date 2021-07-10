import * as PIXI from 'pixi.js';
import { injectable } from 'inversify';
import { BasePixiRenderer } from './BasePixiRenderer';
import { Ray } from '../../structs/Geometry/Ray';
import { SignalRenderer } from '../../structs/Renderers/SignalRenderer';
import { Left } from '../../structs/Geometry/Directions';
import { SignalSignal } from '../../modules/Signaling/SignalSignal';

@injectable()
export class SignalPixiRenderer extends BasePixiRenderer
  implements SignalRenderer {
  private circle: PIXI.Graphics;
  private post: PIXI.Graphics;

  init(data: any): void {
    const rayPost = Ray.fromData(data.ray).fromHere(Left, 4);
    const rayBottom = rayPost.fromHere(Math.PI, 6);
    this.post = new PIXI.Graphics();
    this.post.lineStyle(0.5, 0x000000);
    this.post.moveTo(0, 0);
    this.post.lineTo(
      rayBottom.coord.x - rayPost.coord.x,
      rayBottom.coord.z - rayPost.coord.z
    );
    this.post.zIndex = 9;
    this.post.x = rayPost.coord.x;
    this.post.y = rayPost.coord.z;

    this.circle = new PIXI.Graphics();
    // this.circle.lineStyle(0.25, 0x000000);
    this.circle.beginFill(
      data.signal === SignalSignal.Green ? 0x00ff00 : 0xff0000
    );
    this.circle.drawCircle(0, 0, 2);
    this.circle.endFill();
    this.circle.zIndex = 10;
    this.circle.x = rayPost.coord.x;
    this.circle.y = rayPost.coord.z;

    globalThis.stage.addChild(this.circle);
    globalThis.stage.addChild(this.post);
  }

  update(data: any) {
    this.circle.clear();
    this.circle.beginFill(
      data.signal === SignalSignal.Green ? 0x00ff00 : 0xff0000
    );
    this.circle.drawCircle(0, 0, 2);
    this.circle.endFill();
  }
}
