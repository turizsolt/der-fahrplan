import * as PIXI from 'pixi.js';
import { injectable } from 'inversify';
import { BasePixiRenderer } from './BasePixiRenderer';
import { TrackJointRenderer } from '../../structs/Renderers/TrackJointRenderer';

@injectable()
export class TrackJointPixiRenderer extends BasePixiRenderer
  implements TrackJointRenderer {
  private rectangle: PIXI.Graphics;

  init(data: any) {
    this.rectangle = new PIXI.Graphics();
    this.rectangle.interactive = true;
    this.rectangle.buttonMode = true;
    this.rectangle.beginFill(0x470bef);
    this.rectangle.drawRect(-0.5, -1.5, 1, 3);
    this.rectangle.endFill();

    this.rectangle.x = data.ray.x;
    this.rectangle.y = data.ray.z;
    this.rectangle.rotation = -data.ray.dirXZ;
    this.rectangle.zIndex = 1;

    this.rectangle.on('pointerdown', (event: PIXI.InteractionEvent) => {
      const x =
        (event.data.global.x - globalThis.stage.x) / globalThis.stage.scale.x;
      const y =
        (event.data.global.y - globalThis.stage.y) / globalThis.stage.scale.y;
      event.data.global.x = x;
      event.data.global.y = y;
      globalThis.globalController.down({
        ...event,
        meshId: 'clickable-trackjoint-' + data.id,
        button: event.data.button
      });

      event.stopPropagation();
      event.data.originalEvent.stopPropagation();
    });

    this.rectangle.on('pointerup', (event: PIXI.InteractionEvent) => {
      const x =
        (event.data.global.x - globalThis.stage.x) / globalThis.stage.scale.x;
      const y =
        (event.data.global.y - globalThis.stage.y) / globalThis.stage.scale.y;
      event.data.global.x = x;
      event.data.global.y = y;
      globalThis.globalController.up({
        ...event,
        meshId: 'clickable-trackjoint-' + data.id,
        button: event.data.button
      });

      event.stopPropagation();
      event.data.originalEvent.stopPropagation();
    });

    globalThis.stage.addChild(this.rectangle);
  }

  update() {}

  remove() {
    this.rectangle.renderable = false;
  }
}
