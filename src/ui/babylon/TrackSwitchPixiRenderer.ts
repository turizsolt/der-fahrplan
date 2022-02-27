import * as PIXI from 'pixi.js';
import { injectable } from 'inversify';
import { Track } from '../../modules/Track/Track';
import { BasePixiRenderer } from './BasePixiRenderer';
import { Left, Right } from '../../structs/Geometry/Directions';
import { TrackSwitchRenderer } from '../../structs/Renderers/TrackSwitchRenderer';
import { TrackSwitch } from '../../modules/Track/TrackSwitch';
import { PixiClick } from './PixiClick';

@injectable()
export class TrackSwitchPixiRenderer extends BasePixiRenderer
  implements TrackSwitchRenderer {
  private sw: TrackSwitch;
  private lines: PIXI.Graphics[] = [];

  init(sw: TrackSwitch): void {
    this.sw = sw;

    this.draw(sw.getSegmentLeft().getLineSegmentChain());
    this.draw(sw.getSegmentRight().getLineSegmentChain());
  }

  update() { }

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
    line.beginFill(0xa6bdac);
    line.drawPolygon(polygon);
    line.endFill();
    line.zIndex = 0;

    PixiClick(line, 'trackswitch', this.sw.getId());

    globalThis.stage.addChild(line);

    this.lines.push(line);
  }

  remove() {
    this.lines.map(l => {
      l.clear();
      l.renderable = false;
    });
  }
}
