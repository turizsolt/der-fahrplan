import { ActualTrackCurve } from './ActualTrackCurve';
import { DirectedTrack } from './DirectedTrack';
import { ActualDirectedTrack } from './ActualDirectedTrack';
import { ActualTrackEnd } from './ActualTrackEnd';
import { WhichEnd } from '../../structs/Interfaces/WhichEnd';
import { TrackBase } from './TrackBase';
import { TrackSegment } from './TrackSegment';
import { TrackEnd } from './TrackEnd';
import { TrackCurve } from './TrackCurve';
import { TrackSegmentData } from './TrackSegmentData';
import { TrackDirection } from './TrackDirection';

export class ActualTrackSegment implements TrackSegment {
  protected A: TrackEnd;
  protected B: TrackEnd;
  protected AB: DirectedTrack;
  protected BA: DirectedTrack;
  protected track: TrackBase;

  constructor(track: TrackBase, segmentData: TrackSegmentData) {
    this.track = track;

    this.AB = new ActualDirectedTrack(this, new ActualTrackCurve(segmentData.coordinates), TrackDirection.AB);
    this.BA = new ActualDirectedTrack(this, new ActualTrackCurve([...segmentData.coordinates].reverse()), TrackDirection.BA);
    this.AB.setReverse(this.BA);
    this.BA.setReverse(this.AB);

    this.A = new ActualTrackEnd(this.AB, this.BA, segmentData.startJointEnd);
    this.B = new ActualTrackEnd(this.BA, this.AB, segmentData.endJointEnd);

    this.connect();
  }

  remove(): void {
    this.disconnect();
  }

  getEnd(whichEnd: WhichEnd): TrackEnd {
    return this[whichEnd] ?? null;
  }

  getTrack(): TrackBase {
    return this.track;
  }

  getCurve(): TrackCurve {
    return this.AB.getCurve();
  }

  getLength(): number {
    return this.AB.getLength();
  }

  getDirected(direction: TrackDirection): DirectedTrack {
    return this[direction];
  }

  connect(): void {
    this.A.connect();
    this.B.connect();
  }

  disconnect(): void {
    this.A.disconnect();
    this.B.disconnect();
  }

  persist(): any {
    return {
        startJointEnd: this.A.persist(),
        endJointEnd: this.B.persist(),
        coordinates: this.AB.getCurve().persist()
    };
  }
}
