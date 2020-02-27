import { Coordinate } from '../Geometry/Coordinate';
import { Bezier } from '../Geometry/Bezier/Bezier';
import { BezierCreater } from '../Geometry/Bezier/BezierCreater';

export class TrackSegment {
  readonly length: number;
  readonly isCurve: boolean;
  readonly curvePoints: Coordinate[];
  private bezier: Bezier;

  constructor(coordinates: Coordinate[]) {
    this.bezier = BezierCreater.Create(coordinates);
    this.curvePoints = this.bezier.getLinePoints();
    this.length = this.bezier.getLength();
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

  getCoordinates(): Coordinate[] {
    return this.bezier.getCoordinates();
  }
}
