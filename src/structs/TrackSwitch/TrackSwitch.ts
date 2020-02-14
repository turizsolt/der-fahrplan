import { TrackBase } from '../TrackBase/TrackBase';
import { TrackSegment } from '../TrackBase/TrackSegment';
import { Coordinate } from '../Geometry/Coordinate';
import { TrackSwitchEnd } from './TrackSwitchEnd';

export interface TrackSwitch extends TrackBase {
  init(coordinates1: Coordinate[], coordinates2: Coordinate[]): TrackSwitch;
  switch();
  getSegmentE(): TrackSegment;
  getSegmentF(): TrackSegment;
  getE(): TrackSwitchEnd;
  getF(): TrackSwitchEnd;
  getId(): number;
  getState(): number;
}
