import * as PIXI from 'pixi.js';
import { TrackInputHandlerPlugin } from './TrackInputHandlerPlugin';
import { InputProps } from '../../InputProps';
import { snapHexaXZ } from '../../../../structs/Geometry/Snap';
import { Coordinate } from '../../../../structs/Geometry/Coordinate';
import { BezierCreater } from '../../../../structs/Geometry/Bezier/BezierCreater';
import { Left, Right } from '../../../../structs/Geometry/Directions';

export class TrackInputHandlerPixi implements TrackInputHandlerPlugin {
  private line: PIXI.Graphics;
  private toPoint: PIXI.Graphics;
  private fromPoint: PIXI.Graphics;
  private dir: number = 0;

  constructor() { }
  init() {
    this.toPoint = new PIXI.Graphics();
    this.toPoint.beginFill(0xff0000); //0x0bef47);
    this.toPoint.drawRect(-0.5, -1.5, 1, 3);
    this.toPoint.endFill();
    this.toPoint.rotation = 0;
    this.toPoint.renderable = false;
    globalThis.stage.addChild(this.toPoint);

    this.fromPoint = new PIXI.Graphics();
    this.fromPoint.beginFill(0xff0000); //0x0bef47);
    this.fromPoint.drawRect(-0.5, -1.5, 1, 3);
    this.fromPoint.endFill();
    this.fromPoint.rotation = 0;
    this.fromPoint.renderable = false;
    globalThis.stage.addChild(this.fromPoint);

    this.line = new PIXI.Graphics();
    this.line.lineStyle(1, 0x0000ff, 1);
    globalThis.stage.addChild(this.line);
  }

  down(props: InputProps) {
    if (!props.snappedJoint) {
      this.fromPoint.renderable =
        !props.snappedJoint && !props.snappedPositionOnTrack;
      this.fromPoint.position.x = props.snappedPoint.coord.x;
      this.fromPoint.position.y = props.snappedPoint.coord.z;
      this.fromPoint.rotation = -this.dir;
    }

    this.toPoint.renderable =
      !props.snappedJoint && !props.snappedPositionOnTrack;
    this.toPoint.position.x = props.snappedPoint.coord.x;
    this.toPoint.position.y = props.snappedPoint.coord.z;
    this.toPoint.rotation = -this.dir;

    this.line.renderable = true;
  }

  roam(props: InputProps) {
    const ray = props.snappedPoint;

    this.line.clear();

    if (props.snappedPoint) {
      this.fromPoint.x = ray.coord.x;
      this.fromPoint.y = ray.coord.z;
    }
    this.fromPoint.rotation = -this.dir;
    this.fromPoint.renderable =
      !props.snappedJoint && !props.snappedPositionOnTrack;
  }

  move(downProps: InputProps, props: InputProps) {
    const ray = props.snappedPoint;
    this.toPoint.x = ray.coord.x;
    this.toPoint.y = ray.coord.z;
    this.toPoint.renderable = !props.snappedJoint;

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

    this.line.renderable = midpoint !== false;
  }

  up(downProps: InputProps, props: InputProps) {
    this.fromPoint.renderable = false;
    this.toPoint.renderable = false;
    this.line.renderable = false;
  }

  cancel() {
    this.fromPoint.renderable = false;
    this.toPoint.renderable = false;
    this.line.renderable = false;
  }

  wheel(dir: number): void {
    this.toPoint.rotation = -dir;
    this.dir = dir;
  }
}
