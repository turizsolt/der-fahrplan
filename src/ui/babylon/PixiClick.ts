import * as PIXI from 'pixi.js';

export function PixiClickGeneral(graphics: PIXI.Graphics, type: string, id: string, fn: (x: number, y: number, type: string, id: string) => void) {
    graphics.interactive = true;
    graphics.buttonMode = true;

    graphics.removeAllListeners('pointerdown');
    graphics.removeAllListeners('pointerup');

    graphics.on('pointerdown', (event: PIXI.InteractionEvent) => {
        const x =
            (event.data.global.x - globalThis.stage.x) / globalThis.stage.scale.x;
        const y =
            (event.data.global.y - globalThis.stage.y) / globalThis.stage.scale.y;
        event.data.global.x = x;
        event.data.global.y = y;
        //fn(x, y, type, string);
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
        fn(x, y, type, id);
        event.stopPropagation();
        event.data.originalEvent.stopPropagation();
    });
}

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