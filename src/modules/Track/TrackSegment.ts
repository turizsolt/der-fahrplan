import { Coordinate } from '../../structs/Geometry/Coordinate';
import { Bezier } from '../../structs/Geometry/Bezier/Bezier';
import { BezierCreater } from '../../structs/Geometry/Bezier/BezierCreater';
import { LineSegmentChain } from '../../structs/Geometry/LineSegmentChain';

export class TrackSegment {
  readonly length: number;
  readonly isCurve: boolean;
  readonly curvePoints: Coordinate[];
  private bezier: Bezier;
  private segmentChain: LineSegmentChain;

  constructor(coordinates: Coordinate[]) {
    this.bezier = BezierCreater.Create(coordinates);
    this.segmentChain = this.bezier.getLineSegmentChain();
    this.curvePoints = this.segmentChain.getPoints();
    this.length = this.segmentChain.getLength();
  }

  getCurvePoints(): Coordinate[] {
    return this.curvePoints;
  }

  getLength(): number {
    return this.length;
  }

  getBezier(): Bezier {
    return this.bezier;
  }

  getLineSegmentChain(): LineSegmentChain {
    return this.segmentChain;
  }

  getFirstPoint(): Coordinate {
    return this.curvePoints[0];
  }

  getLastPoint(): Coordinate {
    return this.curvePoints[this.curvePoints.length - 1];
  }

  getCoordinates(): Coordinate[] {
    return this.bezier.getCoordinates();
  }

  persist(): Object {
    return this.getCoordinates().map(a => ({ x: a.x, y: a.y, z: a.z }));
  }
}
