import { TrackBase } from './TrackBase';
import { Coordinate } from '../../structs/Geometry/Coordinate';

export interface TrackSwitch extends TrackBase {
  init(coordinates1: Coordinate[], coordinates2: Coordinate[]): TrackSwitch;
  switch();
}
