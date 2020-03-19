import { TrackBase } from './TrackBase';
import { TrackSegment } from '../Actuals/Track/TrackSegment';
import { Coordinate } from '../Geometry/Coordinate';
import { TrackSwitchEnd } from '../Actuals/Track/TrackSwitchEnd';
import { Ray } from '../Geometry/Ray';

export interface TrackSwitch extends TrackBase {
  init(coordinates1: Coordinate[], coordinates2: Coordinate[]): TrackSwitch;
  switch();
  getSegmentE(): TrackSegment;
  getSegmentF(): TrackSegment;
  getSegmentLeft(): TrackSegment;
  getSegmentRight(): TrackSegment;
  getE(): TrackSwitchEnd;
  getF(): TrackSwitchEnd;
  getState(): number;
  verbose(): void;
  update(): void;

  naturalSplitPoints(): Ray[];
}
