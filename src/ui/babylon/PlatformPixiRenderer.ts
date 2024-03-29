import * as PIXI from 'pixi.js';
import { injectable } from 'inversify';
import { BasePixiRenderer } from './BasePixiRenderer';
import { PlatformRenderer } from '../../structs/Renderers/PlatformRenderer';
import { Platform } from '../../modules/Station/Platform';
import { ITextStyle } from 'pixi.js';

@injectable()
export class PlatformPixiRenderer extends BasePixiRenderer
    implements PlatformRenderer {
    private rect: PIXI.Graphics;
    private text: PIXI.Text;
    private platform: Platform;

    private inited: boolean = false;

    init(platform: Platform) {
        this.platform = platform;
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

        const settings: Partial<ITextStyle> = {
            fontFamily: 'Arial',
            fontSize: 5,
            fill: 0x000000,
            align: 'center'
        };

        this.text = new PIXI.Text(platform.getNo(), settings);
        this.text.x = platform.getPosition().x;
        this.text.y = platform.getPosition().z;
        this.text.zIndex = 30;
        this.text.resolution = 10;
        this.text.anchor.x = 0.5;
        this.text.anchor.y = 0.5;
        globalThis.stage.addChild(this.text);

        this.inited = true;
        this.update();
    }

    update() {
        if (!this.inited) return;
        if (!this.platform) return;

        const color = this.platform.getColor();
        const fillColor =
            color.red * 256 * 256 * 255 + color.green * 256 * 255 + color.blue * 255;
        this.rect.lineStyle(0.5, 0, 1);
        this.rect.beginFill(fillColor);
        this.rect.drawRect(
            -this.platform.getWidth() / 2,
            -this.platform.getLength() / 2,
            this.platform.getWidth(),
            this.platform.getLength()
        );
        this.rect.endFill();

        this.text.text = this.platform.getNo();
    }
}
