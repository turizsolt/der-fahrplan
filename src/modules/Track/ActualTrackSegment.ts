import { TrackCurve } from './TrackCurve';
import { Coordinate } from '../../structs/Geometry/Coordinate';
import { DirectedTrack } from './DirectedTrack';
import { ActualDirectedTrack } from './ActualDirectedTrack';
import { ActualTrackEnd } from './ActualTrackEnd';
import { WhichEnd } from '../../structs/Interfaces/WhichEnd';
import { TrackBase } from './TrackBase';
import { TrackJointEnd } from './TrackJoint/TrackJointEnd';

export class ActualTrackSegment {
  protected A: ActualTrackEnd;
  protected B: ActualTrackEnd;
  protected curve: TrackCurve;
  protected AB: DirectedTrack;
  protected BA: DirectedTrack;
  protected track: TrackBase;

  constructor(track: TrackBase, coordinates: Coordinate[], joints: TrackJointEnd[]) {
    this.track = track;

    // dt
    this.AB = (new ActualDirectedTrack()).init(this);
    this.BA = (new ActualDirectedTrack()).init(this);
    this.AB.setReverse(this.BA);
    this.BA.setReverse(this.AB);

    this.A = new ActualTrackEnd(this.AB, this.BA, joints[0]);
    this.B = new ActualTrackEnd(this.BA, this.AB, joints[1]);
    this.curve = new TrackCurve(coordinates);

    this.connect();
  }

  remove(): void {
    this.disconnect();
  }

  getEnd(whichEnd: WhichEnd): ActualTrackEnd {
    return this[whichEnd] ?? null;
  }

  getTrack(): TrackBase {
    return this.track;
  }

  getCurve(): TrackCurve {
      return this.curve;
  }

  connect(): void {
      this.A.connect();
      this.B.connect();
  }

  disconnect(): void {
    this.A.disconnect();
    this.B.disconnect();
  }
}
