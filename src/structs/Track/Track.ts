import { TrackBase } from '../TrackBase/TrackBase';
import { Coordinate } from '../Geometry/Coordinate';

export interface Track extends TrackBase {
  init(coordinates: Coordinate[]): Track;
}
