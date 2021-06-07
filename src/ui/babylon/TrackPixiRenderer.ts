import * as PIXI from 'pixi.js';
import { TrackRenderer } from '../../structs/Renderers/TrackRenderer';
import { injectable } from 'inversify';
import { Track } from '../../modules/Track/Track';
import { BasePixiRenderer } from './BasePixiRenderer';

@injectable()
export class TrackPixiRenderer extends BasePixiRenderer
  implements TrackRenderer {
  private track: Track;

  init(track: Track): void {
    this.track = track;
    const chain = this.track.getCurve().getLineSegmentChain();
    const rays = chain.getRays();

    let line = new PIXI.Graphics();
    line.lineStyle(4, 0xff0000, 1);
    line.moveTo(rays[0].coord.x, rays[0].coord.z);
    for (let ray of rays) {
      line.lineTo(ray.coord.x, ray.coord.z);
    }
    globalThis.stage.addChild(line);
  }

  update() {}
}
