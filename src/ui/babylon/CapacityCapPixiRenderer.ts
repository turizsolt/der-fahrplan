import * as PIXI from 'pixi.js';
import { injectable } from 'inversify';
import { BasePixiRenderer } from './BasePixiRenderer';
import { Coordinate } from '../../structs/Geometry/Coordinate';
import { Ray } from '../../structs/Geometry/Ray';
import { CapacityCapRenderer } from '../../structs/Renderers/CapacityCapRenderer';
import { ITextStyle } from 'pixi.js';

@injectable()
export class CapacityCapPixiRenderer extends BasePixiRenderer
  implements CapacityCapRenderer {
  private texts: PIXI.Text[] = [];

  init(data: any): void {
    for (let ray of data.rays) {
      const circle = new PIXI.Graphics();
      circle.interactive = true;
      circle.buttonMode = true;
      circle.beginFill(0xcf44ff);
      circle.drawCircle(0, 0, 3);
      circle.endFill();

      circle.x = ray.x;
      circle.y = ray.z;
      circle.zIndex = 40;

      circle.on('pointerdown', (event: PIXI.InteractionEvent) => {
        const x =
          (event.data.global.x - globalThis.stage.x) / globalThis.stage.scale.x;
        const y =
          (event.data.global.y - globalThis.stage.y) / globalThis.stage.scale.y;
        event.data.global.x = x;
        event.data.global.y = y;
        globalThis.inputController.down({
          ...event,
          meshId: 'clickable-capacityCap-' + data.id,
          button: event.data.button
        });

        event.stopPropagation();
        event.data.originalEvent.stopPropagation();
      });

      circle.on('pointerup', (event: PIXI.InteractionEvent) => {
        const x =
          (event.data.global.x - globalThis.stage.x) / globalThis.stage.scale.x;
        const y =
          (event.data.global.y - globalThis.stage.y) / globalThis.stage.scale.y;
        event.data.global.x = x;
        event.data.global.y = y;
        globalThis.inputController.up({
          ...event,
          meshId: 'clickable-capacityCap-' + data.id,
          button: event.data.button
        });

        event.stopPropagation();
        event.data.originalEvent.stopPropagation();
      });

      globalThis.stage.addChild(circle);

      const settings: Partial<ITextStyle> = {
        fontFamily: 'Arial',
        fontSize: 5,
        fill: 0x000000,
        align: 'center'
      };

      let text = new PIXI.Text((data.cap - data.trainCount).toString(), settings);
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
}
