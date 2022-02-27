import * as PIXI from 'pixi.js';
import { injectable } from 'inversify';
import { BasePixiRenderer } from './BasePixiRenderer';
import { Coordinate } from '../../structs/Geometry/Coordinate';
import { Ray } from '../../structs/Geometry/Ray';
import { CapacityCapRenderer } from '../../structs/Renderers/CapacityCapRenderer';
import { ITextStyle } from 'pixi.js';
import { PixiClick } from './PixiClick';
@injectable()
export class CapacityCapPixiRenderer extends BasePixiRenderer
  implements CapacityCapRenderer {
  private texts: PIXI.Text[] = [];
  private circle: PIXI.Graphics;

  init(data: any): void {
    for (let ray of data.rays) {
      this.circle = new PIXI.Graphics();
      this.circle.beginFill(0xcf44ff);
      this.circle.drawCircle(0, 0, 3);
      this.circle.endFill();

      this.circle.x = ray.x;
      this.circle.y = ray.z;
      this.circle.zIndex = 40;

      PixiClick(this.circle, 'capacityCap', data.id);

      globalThis.stage.addChild(this.circle);

      const settings: Partial<ITextStyle> = {
        fontFamily: 'Arial',
        fontSize: 5,
        fill: 0x000000,
        align: 'center'
      };

      const text = new PIXI.Text((data.cap - data.trainCount).toString(), settings);
      text.x = ray.x;
      text.y = ray.z;
      text.zIndex = 41;
      text.resolution = 10;
      text.anchor.x = 0.5;
      text.anchor.y = 0.5;
      globalThis.stage.addChild(text);

      this.texts.push(text);

    }
  }

  update(data: any) {
    for (let text of this.texts) {
      text.text = (data.cap - data.trainCount).toString();
    }
  }

  remove(): void {
    this.circle.clear();
    this.circle.renderable = false;
    this.texts.map((t: PIXI.Text) => {
      t.renderable = false;
    });
  }
}
