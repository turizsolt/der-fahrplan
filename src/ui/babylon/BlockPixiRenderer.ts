import * as PIXI from 'pixi.js';
import { injectable } from 'inversify';
import { BasePixiRenderer } from './BasePixiRenderer';
import { BlockRenderer } from '../../structs/Renderers/BlockRenderer';
import { Coordinate } from '../../structs/Geometry/Coordinate';
import { PixiClick } from './PixiClick';

@injectable()
export class BlockPixiRenderer extends BasePixiRenderer
  implements BlockRenderer {
  private line: PIXI.Graphics;
  private circle: PIXI.Graphics;
  private coords: Coordinate[];

  init(data: any): void {
    this.coords = data.coords;

    this.line = new PIXI.Graphics();
    this.line.lineStyle(2, 0x00ff00, 1);
    this.line.moveTo(this.coords[0].x, this.coords[0].z);
    for (let i = 1; i < this.coords.length; i++) {
      this.line.lineTo(this.coords[i].x, this.coords[i].z);
    }
    this.line.zIndex = 8;

    let coord: Coordinate = null;
    if (this.coords.length % 2 == 1) {
      const i = (this.coords.length - 1) / 2;
      coord = this.coords[i];
    } else {
      const i = this.coords.length / 2;
      coord = this.coords[i - 1].midpoint(this.coords[1]);
    }

    this.circle = new PIXI.Graphics();
    this.circle.lineStyle(0.25, 0x000000, 0.5);
    this.circle.beginFill(0x00ff00);
    this.circle.drawCircle(0, 0, 2);
    this.circle.endFill();
    this.circle.zIndex = 9;
    this.circle.x = coord.x;
    this.circle.y = coord.z;
    PixiClick(this.circle, 'block', data.id);

    globalThis.stage.addChild(this.line);
    globalThis.stage.addChild(this.circle);
  }

  update(data: any) {
    this.line.clear();
    this.line.lineStyle(2, data.isFree ? 0x00ff00 : 0xff0000, 1);
    this.line.moveTo(this.coords[0].x, this.coords[0].z);
    for (let i = 1; i < this.coords.length; i++) {
      this.line.lineTo(this.coords[i].x, this.coords[i].z);
    }
  }

  remove() {
    this.line.clear();
    this.line.renderable = false;
    this.circle.clear();
    this.circle.renderable = false;
  }
}
