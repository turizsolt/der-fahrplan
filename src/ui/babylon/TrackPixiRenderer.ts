import * as PIXI from 'pixi.js';
import { TrackRenderer } from '../../structs/Renderers/TrackRenderer';
import { injectable } from 'inversify';
import { Track } from '../../modules/Track/Track';
import { BasePixiRenderer } from './BasePixiRenderer';
import { Left, Right } from '../../structs/Geometry/Directions';

@injectable()
export class TrackPixiRenderer extends BasePixiRenderer
  implements TrackRenderer {
  private track: Track;

  init(track: Track): void {
    this.track = track;
    const chain = this.track.getCurve().getLineSegmentChain();
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
    line.beginFill(0xa6bdac);
    line.drawPolygon(polygon);
    line.endFill();
    line.zIndex = 0;

    line.on('pointerdown', (event: PIXI.InteractionEvent) => {
      const x =
        (event.data.global.x - globalThis.stage.x) / globalThis.stage.scale.x;
      const y =
        (event.data.global.y - globalThis.stage.y) / globalThis.stage.scale.y;
      event.data.global.x = x;
      event.data.global.y = y;
      globalThis.inputController.down({
        ...event,
        meshId: 'clickable-track-' + track.getId(),
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
        meshId: 'clickable-track-' + track.getId(),
        button: event.data.button
      });

      event.stopPropagation();
      event.data.originalEvent.stopPropagation();
    });

    globalThis.stage.addChild(line);
  }

  update() {}
}
