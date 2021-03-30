import { TrackSegment } from './TrackSegment';
import { Coordinate } from '../../structs/Geometry/Coordinate';
import { DirectedTrack } from './DirectedTrack';
import { ActualDirectedTrack } from './ActualDirectedTrack';
import { ActualTrackEnd } from './ActualTrackEnd';
import { Track } from './Track';

export class ActualTrackSegment {
  protected A: ActualTrackEnd;
  protected B: ActualTrackEnd;
  protected segment: TrackSegment;
  protected AB: DirectedTrack;
  protected BA: DirectedTrack;
  protected track: Track;

  init(track: Track, coordinates: Coordinate[]): ActualTrackSegment {
    this.track = track;

    this.A = new ActualTrackEnd(this.AB, this.BA);
    this.B = new ActualTrackEnd(this.BA, this.AB);
    this.segment = new TrackSegment(coordinates);

    // dt
    this.AB = (new ActualDirectedTrack()).init(this);
    this.BA = (new ActualDirectedTrack()).init(this);
    this.AB.setReverse(this.BA);
    this.BA.setReverse(this.AB);

    return this;
  }

  getTrack(): Track {
    return this.track;
  }
}