import * as PIXI from 'pixi.js';
import { injectable } from 'inversify';
import { BasePixiRenderer } from './BasePixiRenderer';
import { Ray } from '../../structs/Geometry/Ray';
import { PathBlockRenderer } from '../../structs/Renderers/PathBlockRenderer';
import { ITextStyle } from 'pixi.js';
import { WhichEnd } from '../../structs/Interfaces/WhichEnd';
import { PixiClick } from './PixiClick';

@injectable()
export class PathBlockPixiRenderer extends BasePixiRenderer
  implements PathBlockRenderer {
  private circle: PIXI.Graphics;
  private texts: PIXI.Text[];

  init(data: any): void {
    const rayPost = new Ray(data.coord, 0);

    this.circle = new PIXI.Graphics();
    this.circle.lineStyle(0.25, 0x000000);
    this.circle.beginFill(0x800000);
    this.circle.drawCircle(0, 0, 3);
    this.circle.endFill();
    this.circle.zIndex = 20;
    this.circle.x = rayPost.coord.x;
    this.circle.y = rayPost.coord.z;

    PixiClick(this.circle, 'pathBlock', data.id);

    globalThis.stage.addChild(this.circle);

    const settings: Partial<ITextStyle> = {
      fontFamily: 'Arial',
      fontSize: 5,
      fill: 0x000000,
      align: 'center'
    };

    this.texts = [];
    for (let i = 0; i < data.jointEnds.length; i++) {
      let text = new PIXI.Text(i.toString(), settings);
      const ray = Ray.fromData(data.jointEnds[i].ray).fromHere(
        data.jointEnds[i].end === WhichEnd.B ? 0 : Math.PI,
        3
      );
      text.x = ray.coord.x;
      text.y = ray.coord.z;
      text.zIndex = 30;
      text.resolution = 10;
      text.anchor.x = 0.5;
      text.anchor.y = 0.5;
      this.texts.push(text);
      globalThis.stage.addChild(text);
    }
  }

  update(data: any) { }

  remove() {
    this.circle.clear();
    this.circle.renderable = false;
    this.texts.map((t: PIXI.Text) => {
      t.renderable = false;
    });
  }
}
