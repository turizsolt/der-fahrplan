import * as PIXI from 'pixi.js';

export function PixiClick(graphics: PIXI.Graphics, type: string, id: string, append?: string) {
    graphics.interactive = true;
    graphics.buttonMode = true;

    graphics.on('pointerdown', (event: PIXI.InteractionEvent) => {
        const x =
            (event.data.global.x - globalThis.stage.x) / globalThis.stage.scale.x;
        const y =
            (event.data.global.y - globalThis.stage.y) / globalThis.stage.scale.y;
        event.data.global.x = x;
        event.data.global.y = y;
        globalThis.inputController.down({
            ...event,
            meshId: 'clickable-' + type + '-' + id + (append ? ('-' + append) : ''),
            button: event.data.button
        });
        event.stopPropagation();
        event.data.originalEvent.stopPropagation();
    });

    graphics.on('pointerup', (event: PIXI.InteractionEvent) => {
        const x =
            (event.data.global.x - globalThis.stage.x) / globalThis.stage.scale.x;
        const y =
            (event.data.global.y - globalThis.stage.y) / globalThis.stage.scale.y;
        event.data.global.x = x;
        event.data.global.y = y;
        globalThis.inputController.up({
            ...event,
            meshId: 'clickable-' + type + '-' + id + (append ? ('-' + append) : ''),
            button: event.data.button
        });
        event.stopPropagation();
        event.data.originalEvent.stopPropagation();
    });
}