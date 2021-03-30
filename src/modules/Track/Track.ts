import { TrackBase } from './TrackBase';
import { Coordinate } from '../../structs/Geometry/Coordinate';
import { ActualTrackEnd } from './ActualTrackEnd';

export interface Track extends TrackBase {
  init(coordinates: Coordinate[]): Track;

  getAx(): ActualTrackEnd;
  getBx(): ActualTrackEnd;
}
