import * as PIXI from 'pixi.js';
import { injectable } from 'inversify';
import { BasePixiRenderer } from './BasePixiRenderer';
import { Coordinate } from '../../structs/Geometry/Coordinate';
import { SectionRenderer } from '../../structs/Renderers/SectionRenderer';
import { Ray } from '../../structs/Geometry/Ray';
import { PixiClick } from './PixiClick';

@injectable()
export class SectionPixiRenderer extends BasePixiRenderer
  implements SectionRenderer {
  private circleA: PIXI.Graphics;
  private circleB: PIXI.Graphics;
  private coords: Coordinate[];

  init(data: any): void {
    const rayA = Ray.fromData(data.rayA);
    this.circleA = new PIXI.Graphics();
    this.circleA.lineStyle(0.25, 0x000000, 0.5);
    this.circleA.beginFill(0x77ffff);
    this.circleA.drawCircle(0, 0, 2);
    this.circleA.endFill();
    this.circleA.zIndex = 9;
    this.circleA.x = rayA.coord.x;
    this.circleA.y = rayA.coord.z;
    PixiClick(this.circleA, 'section', data.id);

    const rayB = Ray.fromData(data.rayB);
    this.circleB = new PIXI.Graphics();
    this.circleB.lineStyle(0.25, 0x000000, 0.5);
    this.circleB.beginFill(0x77ffff);
    this.circleB.drawCircle(0, 0, 2);
    this.circleB.endFill();
    this.circleB.zIndex = 9;
    this.circleB.x = rayB.coord.x;
    this.circleB.y = rayB.coord.z;
    PixiClick(this.circleB, 'section', data.id);

    globalThis.stage.addChild(this.circleA);
    globalThis.stage.addChild(this.circleB);
  }

  update(data: any) {
    const bothFree = data.isFreeA && data.isFreeB;
    this.circleA.clear();
    this.circleA.lineStyle(0.25, 0x000000, 0.5);
    this.circleA.beginFill(
      bothFree ? 0x77ffff : data.isFreeA ? 0x00ff00 : 0xff0000
    );
    this.circleA.drawCircle(0, 0, 2);
    this.circleA.endFill();

    this.circleB.clear();
    this.circleB.lineStyle(0.25, 0x000000, 0.5);
    this.circleB.beginFill(
      bothFree ? 0x77ffff : data.isFreeB ? 0x00ff00 : 0xff0000
    );
    this.circleB.drawCircle(0, 0, 2);
    this.circleB.endFill();
  }

  remove() {
    this.circleA.clear();
    this.circleA.renderable = false;
    this.circleB.clear();
    this.circleB.renderable = false;
  }
}
