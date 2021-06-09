import * as PIXI from 'pixi.js';
import { injectable } from 'inversify';
import { BasePixiRenderer } from './BasePixiRenderer';
import { TrackJointRenderer } from '../../structs/Renderers/TrackJointRenderer';

@injectable()
export class TrackJointPixiRenderer extends BasePixiRenderer
  implements TrackJointRenderer {
  init(data: any) {
    const rectangle = new PIXI.Graphics();
    rectangle.interactive = true;
    rectangle.buttonMode = true;
    rectangle.beginFill(0x470bef);
    rectangle.drawRect(-0.5, -1.5, 1, 3);
    rectangle.endFill();

    rectangle.x = data.ray.x;
    rectangle.y = data.ray.z;
    rectangle.rotation = -data.ray.dirXZ;
    rectangle.zIndex = 1;

    rectangle.on('pointerdown', (event: PIXI.InteractionEvent) => {
      console.log('mousedown');
      globalThis.globalController.down({
        ...event,
        meshId: 'clickable-trackjoint-' + data.id,
        button: event.data.button
      });

      event.stopPropagation();
      event.data.originalEvent.stopPropagation();
    });

    rectangle.on('pointerup', (event: PIXI.InteractionEvent) => {
      console.log('mouseup');
      globalThis.globalController.up({
        ...event,
        meshId: 'clickable-trackjoint-' + data.id,
        button: event.data.button
      });

      event.stopPropagation();
      event.data.originalEvent.stopPropagation();
    });

    globalThis.stage.addChild(rectangle);
  }

  update() {}
}
