import { TrackBase } from './TrackBase';
import { TrackCurve } from './TrackCurve';
import { Coordinate } from '../../structs/Geometry/Coordinate';
import { Ray } from '../../structs/Geometry/Ray';

export interface TrackSwitch extends TrackBase {
  init(coordinates1: Coordinate[], coordinates2: Coordinate[]): TrackSwitch;
  switch();

  // needs for snap and for rendering
  getSegmentE(): TrackCurve;
  getSegmentF(): TrackCurve;
  getSegmentLeft(): TrackCurve;
  getSegmentRight(): TrackCurve;

  // rendering only
  getState(): number;
  update(): void;

  naturalSplitPoints(): Ray[];
}
