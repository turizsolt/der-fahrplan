import { TrackBase } from './TrackBase';
import { TrackCurve } from './TrackCurve';
import { TrackSegmentData } from './TrackSegmentData';

export interface TrackSwitch extends TrackBase {
  init(
    segmentData1: TrackSegmentData,
    segmentData2: TrackSegmentData
  ): TrackSwitch;
  switch();
  getState(): number;
  lock(): void;
  unlock(): void;
  isLocked(): boolean;

  getSegmentLeft(): TrackCurve;
  getSegmentRight(): TrackCurve;
}
