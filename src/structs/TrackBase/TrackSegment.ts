import { Coordinate } from '../Geometry/Coordinate';
import { Bezier } from '../Geometry/Bezier';

export class TrackSegment {
  readonly length: number;
  readonly isCurve: boolean;
  readonly curvePoints: Coordinate[];
  private bezier: Bezier;

  constructor(coordinates: Coordinate[]) {
    this.bezier = new Bezier(coordinates);
    this.curvePoints = this.bezier.getLinePoints(20);
    this.length = Bezier.getLength(this.curvePoints);
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

  getFirstPoint(): Coordinate {
    return this.curvePoints[0];
  }

  getLastPoint(): Coordinate {
    return this.curvePoints[this.curvePoints.length - 1];
  }
}
