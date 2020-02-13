import { TrackBase } from '../TrackBase/TrackBase';
import { TrackSegment } from '../TrackBase/TrackSegment';

export interface TrackSwitch extends TrackBase {
  switch();
  getSegmentE(): TrackSegment;
  getSegmentF(): TrackSegment;
  getId(): number;
}
