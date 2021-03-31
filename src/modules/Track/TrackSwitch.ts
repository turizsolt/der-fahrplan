import { TrackBase } from './TrackBase';
import { Coordinate } from '../../structs/Geometry/Coordinate';
import { TrackJointEnd } from './TrackJoint/TrackJointEnd';
import { TrackCurve } from './TrackCurve';

export interface TrackSwitch extends TrackBase {
  init(
    coordinates1: Coordinate[],
    coordinates2: Coordinate[],
    jointEnds: TrackJointEnd[]
  ): TrackSwitch;
  switch();
  getState(): number;

  getSegmentE(): TrackCurve;
  getSegmentF(): TrackCurve;
  getSegmentLeft(): TrackCurve;
  getSegmentRight(): TrackCurve;
}
