import * as PIXI from 'pixi.js';
import { injectable } from 'inversify';
import { BasePixiRenderer } from './BasePixiRenderer';
import { BlockJointRenderer } from '../../structs/Renderers/BlockJointRenderer';

@injectable()
export class BlockJointPixiRenderer extends BasePixiRenderer
  implements BlockJointRenderer {
  private rectangle: PIXI.Graphics;
  private rectangle2: PIXI.Graphics;

  init(data: any) {
    this.rectangle = new PIXI.Graphics();
    this.rectangle.interactive = true;
    this.rectangle.buttonMode = true;
    this.rectangle.beginFill(0xa8a632);
    this.rectangle.drawCircle(0, -3, 3);
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
      globalThis.inputController.down({
        ...event,
        meshId: 'clickable-blockjoint-' + data.id + '-jointA',
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
      globalThis.inputController.up({
        ...event,
        meshId: 'clickable-blockjoint-' + data.id + '-jointA',
        button: event.data.button
      });
      event.stopPropagation();
      event.data.originalEvent.stopPropagation();
    });

    ///////////////////////

    this.rectangle2 = new PIXI.Graphics();
    this.rectangle2.interactive = true;
    this.rectangle2.buttonMode = true;
    this.rectangle2.beginFill(0x470bef);
    this.rectangle2.drawCircle(0, +3, 3);
    this.rectangle2.endFill();

    this.rectangle2.x = data.ray.x;
    this.rectangle2.y = data.ray.z;
    this.rectangle2.rotation = -data.ray.dirXZ;
    this.rectangle2.zIndex = 1;

    this.rectangle2.on('pointerdown', (event: PIXI.InteractionEvent) => {
      const x =
        (event.data.global.x - globalThis.stage.x) / globalThis.stage.scale.x;
      const y =
        (event.data.global.y - globalThis.stage.y) / globalThis.stage.scale.y;
      event.data.global.x = x;
      event.data.global.y = y;
      globalThis.inputController.down({
        ...event,
        meshId: 'clickable-blockjoint-' + data.id + '-jointB',
        button: event.data.button
      });

      event.stopPropagation();
      event.data.originalEvent.stopPropagation();
    });

    this.rectangle2.on('pointerup', (event: PIXI.InteractionEvent) => {
      const x =
        (event.data.global.x - globalThis.stage.x) / globalThis.stage.scale.x;
      const y =
        (event.data.global.y - globalThis.stage.y) / globalThis.stage.scale.y;
      event.data.global.x = x;
      event.data.global.y = y;
      globalThis.inputController.up({
        ...event,
        meshId: 'clickable-blockjoint-' + data.id + '-jointB',
        button: event.data.button
      });

      event.stopPropagation();
      event.data.originalEvent.stopPropagation();
    });

    globalThis.stage.addChild(this.rectangle);
    globalThis.stage.addChild(this.rectangle2);
  }

  update() {}

  remove() {
    this.rectangle.renderable = false;
  }
}
