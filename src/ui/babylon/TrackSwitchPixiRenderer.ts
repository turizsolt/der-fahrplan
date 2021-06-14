import * as PIXI from 'pixi.js';
import { injectable } from 'inversify';
import { Track } from '../../modules/Track/Track';
import { BasePixiRenderer } from './BasePixiRenderer';
import { Left, Right } from '../../structs/Geometry/Directions';
import { TrackSwitchRenderer } from '../../structs/Renderers/TrackSwitchRenderer';
import { TrackSwitch } from '../../modules/Track/TrackSwitch';

@injectable()
export class TrackSwitchPixiRenderer extends BasePixiRenderer
  implements TrackSwitchRenderer {
  private sw: TrackSwitch;

  init(sw: TrackSwitch): void {
    this.sw = sw;

    this.draw(sw.getSegmentLeft().getLineSegmentChain());
    this.draw(sw.getSegmentRight().getLineSegmentChain());
  }

  update() {}

  private draw(chain) {
    const rays1 = chain.getRays().map(r => r.fromHere(Left, 1));
    const rays2 = chain
      .getRays()
      .map(r => r.fromHere(Right, 1))
      .reverse();

    const coords = rays1.map(r => new PIXI.Point(r.coord.x, r.coord.z));
    coords.push(...rays2.map(r => new PIXI.Point(r.coord.x, r.coord.z)));
    const polygon = new PIXI.Polygon(coords);

    const line = new PIXI.Graphics();
    line.hitArea = polygon;
    line.interactive = true;
    line.buttonMode = true;
    line.beginFill(0x0bef47);
    line.drawPolygon(polygon);
    line.endFill();
    line.zIndex = 0;

    /*
    line.moveTo(rays[0].coord.x, rays[0].coord.z);
    for (let ray of rays) {
      line.lineTo(ray.coord.x, ray.coord.z);
    }
    */
    //line.lineStyle(4, 0xff0000, 1);

    line.on('pointerdown', (event: PIXI.InteractionEvent) => {
      const x =
        (event.data.global.x - globalThis.stage.x) / globalThis.stage.scale.x;
      const y =
        (event.data.global.y - globalThis.stage.y) / globalThis.stage.scale.y;
      event.data.global.x = x;
      event.data.global.y = y;
      globalThis.inputController.down({
        ...event,
        meshId: 'clickable-trackswitch-' + this.sw.getId(),
        button: event.data.button
      });

      event.stopPropagation();
      event.data.originalEvent.stopPropagation();
    });

    line.on('pointerup', (event: PIXI.InteractionEvent) => {
      const x =
        (event.data.global.x - globalThis.stage.x) / globalThis.stage.scale.x;
      const y =
        (event.data.global.y - globalThis.stage.y) / globalThis.stage.scale.y;
      event.data.global.x = x;
      event.data.global.y = y;
      globalThis.inputController.up({
        ...event,
        meshId: 'clickable-trackswitch-' + this.sw.getId(),
        button: event.data.button
      });

      event.stopPropagation();
      event.data.originalEvent.stopPropagation();
    });

    globalThis.stage.addChild(line);
  }
}
