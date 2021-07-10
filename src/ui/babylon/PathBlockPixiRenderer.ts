import * as PIXI from 'pixi.js';
import { injectable } from 'inversify';
import { BasePixiRenderer } from './BasePixiRenderer';
import { Ray } from '../../structs/Geometry/Ray';
import { PathBlockRenderer } from '../../structs/Renderers/PathBlockRenderer';

@injectable()
export class PathBlockPixiRenderer extends BasePixiRenderer
  implements PathBlockRenderer {
  private circle: PIXI.Graphics;

  init(data: any): void {
    const rayPost = new Ray(data.coord, 0);

    this.circle = new PIXI.Graphics();
    this.circle.lineStyle(0.25, 0x000000);
    this.circle.beginFill(0x800000);
    this.circle.drawCircle(0, 0, 6);
    this.circle.endFill();
    this.circle.zIndex = 20;
    this.circle.x = rayPost.coord.x;
    this.circle.y = rayPost.coord.z;
    this.circle.interactive = true;
    this.circle.buttonMode = true;

    this.circle.on('pointerdown', (event: PIXI.InteractionEvent) => {
      const x =
        (event.data.global.x - globalThis.stage.x) / globalThis.stage.scale.x;
      const y =
        (event.data.global.y - globalThis.stage.y) / globalThis.stage.scale.y;
      event.data.global.x = x;
      event.data.global.y = y;
      globalThis.inputController.down({
        ...event,
        meshId: 'clickable-pathBlock-' + data.id,
        button: event.data.button
      });

      event.stopPropagation();
      event.data.originalEvent.stopPropagation();
    });

    this.circle.on('pointerup', (event: PIXI.InteractionEvent) => {
      const x =
        (event.data.global.x - globalThis.stage.x) / globalThis.stage.scale.x;
      const y =
        (event.data.global.y - globalThis.stage.y) / globalThis.stage.scale.y;
      event.data.global.x = x;
      event.data.global.y = y;
      globalThis.inputController.up({
        ...event,
        meshId: 'clickable-pathBlock-' + data.id,
        button: event.data.button
      });

      event.stopPropagation();
      event.data.originalEvent.stopPropagation();
    });

    globalThis.stage.addChild(this.circle);
  }

  update(data: any) {}
}
