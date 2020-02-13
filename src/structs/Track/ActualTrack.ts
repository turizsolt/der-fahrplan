import { TrackEnd } from './TrackEnd';
import { TrackSegment } from '../TrackBase/TrackSegment';
import { TrackRenderer } from './TrackRenderer';
import { babylonContainer } from '../inversify.config';
import { TYPES } from '../TYPES';
import { Coordinate } from '../Geometry/Coordinate';
import { Track } from './Track';
import { ActualTrackBase } from '../TrackBase/ActualTrackBase';

export class ActualTrack extends ActualTrackBase implements Track {
  protected A: TrackEnd;
  protected B: TrackEnd;
  protected I: Coordinate;
  protected segment: TrackSegment;
  private renderer: TrackRenderer;

  constructor(a: Coordinate, b: Coordinate, i?: Coordinate) {
    super();
    const ap = new Coordinate(a.x, 0, a.z);
    const bp = new Coordinate(b.x, 0, b.z);
    this.A = new TrackEnd(ap, this);
    this.B = new TrackEnd(bp, this);
    if (i) {
      this.I = new Coordinate(i.x, 0, i.z);
    }
    this.segment = new TrackSegment(this.I ? [ap, this.I, bp] : [ap, bp]);

    this.renderer = babylonContainer.get<TrackRenderer>(TYPES.TrackRenderer);
    this.renderer.init(this);
  }
}
