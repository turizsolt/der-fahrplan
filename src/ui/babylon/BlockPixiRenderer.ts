import * as PIXI from 'pixi.js';
import { injectable } from 'inversify';
import { BasePixiRenderer } from './BasePixiRenderer';
import { BlockRenderer } from '../../structs/Renderers/BlockRenderer';
import { Coordinate } from '../../structs/Geometry/Coordinate';

@injectable()
export class BlockPixiRenderer extends BasePixiRenderer
  implements BlockRenderer {
  private line: PIXI.Graphics;
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

    globalThis.stage.addChild(this.line);
  }

  update(data: any) {
    this.line.lineStyle(2, data.isFree ? 0x00ff00 : 0xff0000, 1);
    this.line.moveTo(this.coords[0].x, this.coords[0].z);
    for (let i = 1; i < this.coords.length; i++) {
      this.line.lineTo(this.coords[i].x, this.coords[i].z);
    }
  }

  remove() {
    this.line.clear();
    this.line.renderable = false;
  }
}
