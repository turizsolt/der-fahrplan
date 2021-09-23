import * as PIXI from 'pixi.js';
import { injectable } from 'inversify';
import { BasePixiRenderer } from './BasePixiRenderer';
import { SensorRenderer } from '../../structs/Renderers/SensorRenderer';

@injectable()
export class SensorPixiRenderer extends BasePixiRenderer
    implements SensorRenderer {
    private rect: PIXI.Graphics;

    private inited: boolean = false;

    init(data: any): void {
        this.rect = new PIXI.Graphics();
        this.rect.interactive = true;
        this.rect.buttonMode = true;
        this.rect.x = data.ray.x;
        this.rect.y = data.ray.z;
        this.rect.zIndex = 80;

        this.rect.on('pointerdown', (event: PIXI.InteractionEvent) => {
            const x =
                (event.data.global.x - globalThis.stage.x) / globalThis.stage.scale.x;
            const y =
                (event.data.global.y - globalThis.stage.y) / globalThis.stage.scale.y;
            event.data.global.x = x;
            event.data.global.y = y;
            globalThis.inputController.down({
                ...event,
                meshId: 'clickable-sensor-' + data.id,
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
                meshId: 'clickable-sensor-' + data.id,
                button: event.data.button
            });

            event.stopPropagation();
            event.data.originalEvent.stopPropagation();
        });

        globalThis.stage.addChild(this.rect);

        this.inited = true;
        this.update(data);
    }

    update(data: any): void {
        if (!this.inited) return;

        this.rect.clear();
        this.rect.beginFill(255 * 256 * 256 + 255 * 256 + 255, 1);
        this.rect.drawCircle(0, 0, 1);
        this.rect.endFill();
    }
}
