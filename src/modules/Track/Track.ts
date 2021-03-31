import { TrackBase } from './TrackBase';
import { Coordinate } from '../../structs/Geometry/Coordinate';
import { ActualTrackEnd } from './ActualTrackEnd';
import { TrackJointEnd } from './TrackJoint/TrackJointEnd';

export interface Track extends TrackBase {
  init(coordinates: Coordinate[], joints: TrackJointEnd[]): Track;

  getAx(): ActualTrackEnd;
  getBx(): ActualTrackEnd;
}
