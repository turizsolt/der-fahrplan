import * as PIXI from 'pixi.js';
import { injectable } from 'inversify';
import { BasePixiRenderer } from './BasePixiRenderer';
import { PassengerRenderer } from '../../structs/Renderers/PassengerRenderer';
import { Passenger } from '../../modules/Passenger/Passenger';

@injectable()
export class PassengerPixiRenderer extends BasePixiRenderer
    implements PassengerRenderer {
    private rect: PIXI.Graphics;
    private passenger: Passenger;

    private inited: boolean = false;

    init(passenger: Passenger) {
        this.passenger = passenger;
        this.rect = new PIXI.Graphics();
        this.rect.interactive = true;
        this.rect.buttonMode = true;
        this.rect.x = passenger.getPosition().x;
        this.rect.y = passenger.getPosition().z;
        this.rect.zIndex = 20;

        this.rect.on('pointerdown', (event: PIXI.InteractionEvent) => {
            const x =
                (event.data.global.x - globalThis.stage.x) / globalThis.stage.scale.x;
            const y =
                (event.data.global.y - globalThis.stage.y) / globalThis.stage.scale.y;
            event.data.global.x = x;
            event.data.global.y = y;
            globalThis.inputController.down({
                ...event,
                meshId: 'clickable-passenger-' + passenger.getId(),
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
                meshId: 'clickable-passenger-' + passenger.getId(),
                button: event.data.button
            });

            event.stopPropagation();
            event.data.originalEvent.stopPropagation();
        });

        globalThis.stage.addChild(this.rect);

        this.inited = true;
        this.update();
    }

    update() {
        if (!this.inited) return;
        if (!this.passenger) return;

        const color = this.passenger.getColor();
        const fillColor =
            color.red * 256 * 256 * 255 + color.green * 256 * 255 + color.blue * 255;
        this.rect.clear();
        if (this.passenger.getPlace()) {
            this.rect.lineStyle(0.2, 0, 1);
            this.rect.beginFill(fillColor);
            this.rect.drawCircle(0, 0, 1);
            this.rect.x = this.passenger.getPosition().x;
            this.rect.y = this.passenger.getPosition().z;
            this.rect.endFill();
        }
    }
}
