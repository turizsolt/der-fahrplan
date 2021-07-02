import * as PIXI from 'pixi.js';
import { injectable } from 'inversify';
import { BasePixiRenderer } from './BasePixiRenderer';
import { PlatformRenderer } from '../../structs/Renderers/PlatformRenderer';
import { Platform } from '../../structs/Interfaces/Platform';

@injectable()
export class PlatformPixiRenderer extends BasePixiRenderer
  implements PlatformRenderer {
  private rect: PIXI.Graphics;

  private inited: boolean = false;

  init(platform: Platform) {
    this.rect = new PIXI.Graphics();
    this.rect.interactive = true;
    this.rect.buttonMode = true;
    this.rect.x = platform.getPosition().x;
    this.rect.y = platform.getPosition().z;
    this.rect.rotation = -platform.getRotation();
    this.rect.zIndex = 4;

    this.rect.on('pointerdown', (event: PIXI.InteractionEvent) => {
      const x =
        (event.data.global.x - globalThis.stage.x) / globalThis.stage.scale.x;
      const y =
        (event.data.global.y - globalThis.stage.y) / globalThis.stage.scale.y;
      event.data.global.x = x;
      event.data.global.y = y;
      globalThis.inputController.down({
        ...event,
        meshId: 'clickable-platform-' + platform.getId(),
        button: event.data.button
      });

      event.stopPropagation();
      event.data.originalEvent.stopPropagation();
    });

    this.rect.on('pointerup', (event: PIXI.InteractionEvent) => {
      const x =
        (event.data.global.x - globalThis.stage.x) / globalThis.stage.scale.x;
      const y =
        (event.data.global.y - globalThis.stage.y) / globalThis.stage.scale.y;
      event.data.global.x = x;
      event.data.global.y = y;
      globalThis.inputController.up({
        ...event,
        meshId: 'clickable-platform-' + platform.getId(),
        button: event.data.button
      });

      event.stopPropagation();
      event.data.originalEvent.stopPropagation();
    });

    globalThis.stage.addChild(this.rect);

    this.inited = true;
    this.update(platform);
  }

  update(platform: Platform) {
    if (!this.inited) return;

    const color = platform.getColor();
    const fillColor =
      color.red * 256 * 256 * 255 + color.green * 256 * 255 + color.blue * 255;
    this.rect.beginFill(fillColor);
    this.rect.drawRect(
      -platform.getWidth() / 2,
      -platform.getLength() / 2,
      platform.getWidth(),
      platform.getLength()
    );
    this.rect.endFill();
  }
}
