import * as PIXI from 'pixi.js';
import { TrackInputHandlerPlugin } from './TrackInputHandlerPlugin';
import { InputProps } from '../InputProps';
import { snapHexaXZ } from '../../../structs/Geometry/Snap';
import { Coordinate } from '../../../structs/Geometry/Coordinate';
import { BezierCreater } from '../../../structs/Geometry/Bezier/BezierCreater';
import { Left, Right } from '../../../structs/Geometry/Directions';

export class TrackInputHandlerPixi implements TrackInputHandlerPlugin {
  private line: PIXI.Graphics;
  private point: PIXI.Graphics;

  constructor() {}
  init() {
    this.point = new PIXI.Graphics();
    this.point.beginFill(0xff0000); //0x0bef47);
    this.point.drawRect(-0.5, -1.5, 1, 3);
    this.point.endFill();
    this.point.rotation = 0;
    globalThis.stage.addChild(this.point);

    this.line = new PIXI.Graphics();
    this.line.lineStyle(1, 0x0000ff, 1);
    globalThis.stage.addChild(this.line);
  }

  down(props: InputProps) {}

  roam(props: InputProps) {
    const ray = snapHexaXZ(props.point);
    this.point.x = ray.coord.x;
    this.point.y = ray.coord.z;
    this.line.clear();
  }

  move(downProps: InputProps, props: InputProps) {
    const ray = snapHexaXZ(props.point);
    this.point.x = ray.coord.x;
    this.point.y = ray.coord.z;

    const midpoint = downProps.snappedPoint.computeMidpoint(props.snappedPoint);
    const midpointCoord: Coordinate = midpoint === false ? undefined : midpoint;
    const chain = BezierCreater.Create([
      downProps.snappedPoint.coord,
      midpointCoord,
      props.snappedPoint.coord
    ]).getLineSegmentChain();

    const rays1 = chain.getRays().map(r => r.fromHere(Left, 0.25));
    const rays2 = chain
      .getRays()
      .map(r => r.fromHere(Right, 0.25))
      .reverse();

    const coords = rays1.map(r => new PIXI.Point(r.coord.x, r.coord.z));
    coords.push(...rays2.map(r => new PIXI.Point(r.coord.x, r.coord.z)));
    const polygon = new PIXI.Polygon(coords);

    this.line.clear();
    this.line.hitArea = polygon;
    this.line.beginFill(0x0000ff);
    this.line.drawPolygon(polygon);
    this.line.endFill();
    this.line.zIndex = 2;
  }

  up(downProps: InputProps, props: InputProps) {}

  cancel() {}

  wheel(dir: number): void {
    this.point.rotation = -dir;
  }
}
