import * as PIXI from 'pixi.js';
import { injectable } from 'inversify';
import { BasePixiRenderer } from './BasePixiRenderer';
import { SensorRenderer } from '../../structs/Renderers/SensorRenderer';
import { PixiClick } from './PixiClick';

@injectable()
export class SensorPixiRenderer extends BasePixiRenderer
    implements SensorRenderer {
    private rect: PIXI.Graphics;

    private inited: boolean = false;

    init(data: any): void {
        this.rect = new PIXI.Graphics();
        this.rect.x = data.ray.x;
        this.rect.y = data.ray.z;
        this.rect.zIndex = 80;

        PixiClick(this.rect, 'sensor', data.id);

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

    remove() {
        this.rect.clear();
        this.rect.renderable = false;
    }
}
