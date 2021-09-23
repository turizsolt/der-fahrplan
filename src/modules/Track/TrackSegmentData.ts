import { Coordinate } from '../../structs/Geometry/Coordinate';
import { TrackJointEnd } from './TrackJoint/TrackJointEnd';

export interface TrackSegmentData {
  startJointEnd: TrackJointEnd;
  endJointEnd: TrackJointEnd;
  coordinates: Coordinate[];
}
