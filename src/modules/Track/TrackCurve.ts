import { Coordinate } from '../../structs/Geometry/Coordinate';
import { Bezier } from '../../structs/Geometry/Bezier/Bezier';
import { LineSegmentChain } from '../../structs/Geometry/LineSegmentChain';

export interface TrackCurve {
  getCurvePoints(): Coordinate[];
  getLength(): number;
  getBezier(): Bezier;
  getLineSegmentChain(): LineSegmentChain;
  getFirstPoint(): Coordinate;
  getLastPoint(): Coordinate;
  getCoordinates(): Coordinate[];
  persist(): Object;
}
