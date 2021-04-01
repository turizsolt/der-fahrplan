import { TrackBase } from './TrackBase';
import { Coordinate } from '../../structs/Geometry/Coordinate';
import { TrackEnd } from './TrackEnd';
import { TrackJointEnd } from './TrackJoint/TrackJointEnd';

export interface Track extends TrackBase {
  init(coordinates: Coordinate[], joints: TrackJointEnd[]): Track;

  getAx(): TrackEnd;
  getBx(): TrackEnd;
}
