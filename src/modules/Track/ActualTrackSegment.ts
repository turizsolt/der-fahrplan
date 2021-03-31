import { TrackCurve } from './TrackCurve';
import { Coordinate } from '../../structs/Geometry/Coordinate';
import { DirectedTrack } from './DirectedTrack';
import { ActualDirectedTrack } from './ActualDirectedTrack';
import { ActualTrackEnd } from './ActualTrackEnd';
import { WhichEnd } from '../../structs/Interfaces/WhichEnd';
import { TrackBase } from './TrackBase';

export class ActualTrackSegment {
  protected A: ActualTrackEnd;
  protected B: ActualTrackEnd;
  protected curve: TrackCurve;
  protected AB: DirectedTrack;
  protected BA: DirectedTrack;
  protected track: TrackBase;

  init(track: TrackBase, coordinates: Coordinate[]): ActualTrackSegment {
    this.track = track;

    // dt
    this.AB = (new ActualDirectedTrack()).init(this);
    this.BA = (new ActualDirectedTrack()).init(this);
    this.AB.setReverse(this.BA);
    this.BA.setReverse(this.AB);

    this.A = new ActualTrackEnd(this.AB, this.BA);
    this.B = new ActualTrackEnd(this.BA, this.AB);
    this.curve = new TrackCurve(coordinates);

    return this;
  }

  getEnd(whichEnd: WhichEnd): ActualTrackEnd {
    return this[whichEnd] ?? null;
  }

  getTrack(): TrackBase {
    return this.track;
  }
}
