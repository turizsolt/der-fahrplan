import { TrackBase } from './TrackBase';
import { Coordinate } from '../../structs/Geometry/Coordinate';

export interface Track extends TrackBase {
  init(coordinates: Coordinate[]): Track;
}
