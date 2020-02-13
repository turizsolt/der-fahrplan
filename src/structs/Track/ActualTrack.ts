import { TrackEnd } from './TrackEnd';
import { TrackSegment } from '../TrackBase/TrackSegment';
import { TrackRenderer } from './TrackRenderer';
import { babylonContainer } from '../inversify.config';
import { TYPES } from '../TYPES';
import { Coordinate } from '../Geometry/Coordinate';
import { Track } from './Track';
import { ActualTrackBase } from '../TrackBase/ActualTrackBase';

export class ActualTrack extends ActualTrackBase implements Track {
  readonly A: TrackEnd;
  readonly B: TrackEnd;
  readonly I: Coordinate;
  readonly segment: TrackSegment;
  private renderer: TrackRenderer;

  constructor(a: Coordinate, b: Coordinate, i?: Coordinate) {
    super();
    this.A = new TrackEnd(new Coordinate(a.x, 0, a.z), this);
    this.B = new TrackEnd(new Coordinate(b.x, 0, b.z), this);
    if (i) {
      this.I = new Coordinate(i.x, 0, i.z);
    }
    this.segment = new TrackSegment(this.A.point, this.B.point, this.I);

    this.renderer = babylonContainer.get<TrackRenderer>(TYPES.TrackRenderer);
    this.renderer.init(this);
  }
}
