import * as PIXI from 'pixi.js';
import { injectable } from 'inversify';
import { BasePixiRenderer } from './BasePixiRenderer';
import { StationRenderer } from '../../structs/Renderers/StationRenderer';
import { Station } from '../../modules/Station/Station';

@injectable()
export class StationPixiRenderer extends BasePixiRenderer
    implements StationRenderer {
    private rect: PIXI.Graphics;

    private inited: boolean = false;

    init(station: Station) {
        this.rect = new PIXI.Graphics();
        this.rect.interactive = true;
        this.rect.buttonMode = true;
        this.rect.x = station.getCircle().a.x;
        this.rect.y = station.getCircle().a.z;
        this.rect.zIndex = -4;

        this.rect.on('pointerdown', (event: PIXI.InteractionEvent) => {
            const x =
                (event.data.global.x - globalThis.stage.x) / globalThis.stage.scale.x;
            const y =
                (event.data.global.y - globalThis.stage.y) / globalThis.stage.scale.y;
            event.data.global.x = x;
            event.data.global.y = y;
            globalThis.inputController.down({
                ...event,
                meshId: 'clickable-station-' + station.getId(),
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
                meshId: 'clickable-station-' + station.getId(),
                button: event.data.button
            });

            event.stopPropagation();
            event.data.originalEvent.stopPropagation();
        });

        globalThis.stage.addChild(this.rect);

        this.inited = true;
        this.update(station);
    }

    update(station: Station) {
        if (!this.inited) return;

        const color = station.getColor();
        const fillColor =
            color.red * 256 * 256 * 255 + color.green * 256 * 255 + color.blue * 255;
        this.rect.clear();
        this.rect.beginFill(fillColor, 0.3);
        this.rect.drawCircle(0, 0, 50);
        this.rect.endFill();
    }
}
