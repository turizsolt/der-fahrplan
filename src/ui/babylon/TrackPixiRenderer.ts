import * as PIXI from 'pixi.js';
import { TrackRenderer } from '../../structs/Renderers/TrackRenderer';
import { injectable } from 'inversify';
import { Track } from '../../modules/Track/Track';
import { BasePixiRenderer } from './BasePixiRenderer';
import { Left, Right } from '../../structs/Geometry/Directions';
import { PixiClick } from './PixiClick';

@injectable()
export class TrackPixiRenderer extends BasePixiRenderer
  implements TrackRenderer {
  private track: Track;
  private line: PIXI.Graphics;

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

    this.line = new PIXI.Graphics();
    this.line.hitArea = polygon;
    this.line.beginFill(0xa6bdac);
    this.line.drawPolygon(polygon);
    this.line.endFill();
    this.line.zIndex = 0;

    PixiClick(this.line, 'track', track.getId());

    globalThis.stage.addChild(this.line);
  }

  update() { }

  remove() {
    console.log('tr pixi rem');
    this.line.clear();
    this.line.renderable = false;
  }
}
