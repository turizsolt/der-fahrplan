import { TrackBase } from './TrackBase';
import { TrackCurve } from './TrackCurve';
import { Coordinate } from '../../structs/Geometry/Coordinate';
import { TrackSwitchEnd } from './TrackSwitchEnd';
import { Ray } from '../../structs/Geometry/Ray';

export interface TrackSwitch extends TrackBase {
  init(coordinates1: Coordinate[], coordinates2: Coordinate[]): TrackSwitch;
  switch();
  getSegmentE(): TrackCurve;
  getSegmentF(): TrackCurve;
  getSegmentLeft(): TrackCurve;
  getSegmentRight(): TrackCurve;
  getE(): TrackSwitchEnd;
  getF(): TrackSwitchEnd;
  getState(): number;
  verbose(): void;
  update(): void;

  naturalSplitPoints(): Ray[];
}
