import { TrackBase } from './TrackBase';
import { TrackEnd } from './TrackEnd';
import { TrackSegmentData } from './TrackSegmentData';

export interface Track extends TrackBase {
  init(segmentData: TrackSegmentData): Track;

  getAx(): TrackEnd;
  getBx(): TrackEnd;

  getTrackType(): string;
}
