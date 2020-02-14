import { TrackEnd } from './TrackEnd';
import { TrackSegment } from '../TrackBase/TrackSegment';
import { TrackRenderer } from './TrackRenderer';
import { TYPES } from '../TYPES';
import { Coordinate } from '../Geometry/Coordinate';
import { Track } from './Track';
import { ActualTrackBase } from '../TrackBase/ActualTrackBase';
import { injectable, inject } from 'inversify';
import { WhichEnd } from './WhichEnd';

@injectable()
export class ActualTrack extends ActualTrackBase implements Track {
  protected A: TrackEnd;
  protected B: TrackEnd;
  protected segment: TrackSegment;
  @inject(TYPES.TrackRenderer) private renderer: TrackRenderer;

  init(coordinates: Coordinate[]): Track {
    this.A = new TrackEnd(WhichEnd.A, this);
    this.B = new TrackEnd(WhichEnd.B, this);
    this.segment = new TrackSegment(coordinates);
    this.renderer.init(this);
    return this;
  }

  remove(): void {
    super.remove();
    this.renderer.update();
  }
}
