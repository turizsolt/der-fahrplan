import * as BABYLON from 'babylonjs';
import { Coordinate } from '../Coordinate';
import { CoordinateToBabylonVector3 } from '../CoordinateToBabylonVector3';

export class TrackSegment {
  readonly length: number;
  readonly isCurve: boolean;
  readonly curvePoints?: Coordinate[];

  constructor(
    a: Coordinate,
    b: Coordinate,
    i?: Coordinate,
    mustCurve: boolean = false
  ) {
    if (!i && mustCurve) {
      i = new Coordinate((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2);
    }

    if (i) {
      const bezier = BABYLON.Curve3.CreateQuadraticBezier(
        CoordinateToBabylonVector3(a),
        CoordinateToBabylonVector3(i),
        CoordinateToBabylonVector3(b),
        20
      );
      this.curvePoints = bezier.getPoints();
      this.length = bezier.length();
      this.isCurve = true;
    } else {
      this.length = Math.sqrt(
        Math.pow(Math.abs(a.x - b.x), 2) + Math.pow(Math.abs(a.z - b.z), 2)
      );
      this.curvePoints = [a, b];
      this.isCurve = false;
    }
  }
}
