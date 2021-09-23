import * as PIXI from 'pixi.js';
import { injectable } from 'inversify';
import { BasePixiRenderer } from './BasePixiRenderer';
import { WaitingHallRenderer } from '../../structs/Renderers/WaitingHallRenderer';

@injectable()
export class WaitingHallPixiRenderer extends BasePixiRenderer
    implements WaitingHallRenderer {
    private rect: PIXI.Graphics;

    private inited: boolean = false;

    init(waitingHall: any) {
        this.rect = new PIXI.Graphics();
        this.rect.interactive = true;
        this.rect.buttonMode = true;
        this.rect.zIndex = 1;

        this.rect.on('pointerdown', (event: PIXI.InteractionEvent) => {
            const x =
                (event.data.global.x - globalThis.stage.x) / globalThis.stage.scale.x;
            const y =
                (event.data.global.y - globalThis.stage.y) / globalThis.stage.scale.y;
            event.data.global.x = x;
            event.data.global.y = y;
            globalThis.inputController.down({
                ...event,
                meshId: 'clickable-waitingHall-' + waitingHall.id,
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
                meshId: 'clickable-waitingHall-' + waitingHall.id,
                button: event.data.button
            });

            event.stopPropagation();
            event.data.originalEvent.stopPropagation();
        });

        globalThis.stage.addChild(this.rect);

        this.inited = true;
        this.update(waitingHall);
    }

    update(waitingHall: any) {
        if (!this.inited) return;

        const color = waitingHall.color;
        const fillColor =
            color.red * 256 * 256 * 255 + color.green * 256 * 255 + color.blue * 255;
        this.rect.clear();
        this.rect.x = waitingHall.position.x;
        this.rect.y = waitingHall.position.z;
        this.rect.lineStyle(0.5, 0, 1);
        this.rect.beginFill(fillColor, 1);
        this.rect.drawCircle(0, 0, waitingHall.radius);
        this.rect.endFill();
    }
}
