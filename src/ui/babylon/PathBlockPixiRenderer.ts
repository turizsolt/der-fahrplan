import * as PIXI from 'pixi.js';
import { injectable } from 'inversify';
import { BasePixiRenderer } from './BasePixiRenderer';
import { Ray } from '../../structs/Geometry/Ray';
import { PathBlockRenderer } from '../../structs/Renderers/PathBlockRenderer';
import { ITextStyle } from 'pixi.js';
import { WhichEnd } from '../../structs/Interfaces/WhichEnd';

@injectable()
export class PathBlockPixiRenderer extends BasePixiRenderer
  implements PathBlockRenderer {
  private circle: PIXI.Graphics;

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

    const settings: Partial<ITextStyle> = {
      fontFamily: 'Arial',
      fontSize: 5,
      fill: 0x000000,
      align: 'center'
    };

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
      globalThis.stage.addChild(text);
    }
  }

  update(data: any) { }
}
