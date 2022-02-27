import * as PIXI from 'pixi.js';
import { injectable } from 'inversify';
import { BasePixiRenderer } from './BasePixiRenderer';
import { WaitingHallRenderer } from '../../structs/Renderers/WaitingHallRenderer';
import { PixiClick } from './PixiClick';

@injectable()
export class WaitingHallPixiRenderer extends BasePixiRenderer
    implements WaitingHallRenderer {
    private rect: PIXI.Graphics;

    private inited: boolean = false;

    init(waitingHall: any) {
        this.rect = new PIXI.Graphics();
        this.rect.zIndex = 1;

        PixiClick(this.rect, 'waitingHall', waitingHall.id);

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

    remove() {
        this.rect.clear();
        this.rect.renderable = false;
    }
}
