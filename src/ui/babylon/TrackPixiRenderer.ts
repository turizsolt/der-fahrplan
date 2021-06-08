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
    line.beginFill(0x0bef47);
    line.drawPolygon(polygon);
    line.endFill();

    /*
    line.moveTo(rays[0].coord.x, rays[0].coord.z);
    for (let ray of rays) {
      line.lineTo(ray.coord.x, ray.coord.z);
    }
    */
    //line.lineStyle(4, 0xff0000, 1);

    line.on('pointerdown', event => {
      console.log('mousedown');
      globalThis.globalController.down({
        ...event,
        meshId: 'clickable-track-' + track.getId(),
        button: event.data.button
      });
    });

    line.on('pointerup', event => {
      console.log('mouseup');
      globalThis.globalController.up({
        ...event,
        meshId: 'clickable-track-' + track.getId(),
        button: event.data.button
      });
    });
    globalThis.stage.addChild(line);
  }

  update() {}
}
