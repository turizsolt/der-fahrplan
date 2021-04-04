import { TrackRenderer } from '../../structs/Renderers/TrackRenderer';
import { TYPES } from '../../di/TYPES';
import { Track } from './Track';
import { ActualTrackBase } from './ActualTrackBase';
import { injectable, inject } from 'inversify';
import { WhichEnd } from '../../structs/Interfaces/WhichEnd';
import { BaseRenderer } from '../../structs/Renderers/BaseRenderer';
import { Store } from '../../structs/Interfaces/Store';
import { ActualTrackSegment } from './ActualTrackSegment';
import { TrackEnd } from './TrackEnd';
import { TrackCurve } from './TrackCurve';
import { TrackSegmentData } from './TrackSegmentData';
import { TrackDirection } from './TrackDirection';
import { DirectedTrack } from './DirectedTrack';

@injectable()
export class ActualTrack extends ActualTrackBase implements Track {
  protected segment: ActualTrackSegment;

  @inject(TYPES.TrackRenderer) private renderer: TrackRenderer;

  init(segmentData: TrackSegmentData): Track {
    super.initStore(TYPES.Track);

    this.segment = new ActualTrackSegment(this, segmentData);

    // todo emit
    this.renderer.init(this);
    return this;
  }

  getDirected(direction: TrackDirection): DirectedTrack {
    return this.segment.getDirected(direction);
  }

  getCurve(): TrackCurve {
    return this.segment.getCurve();
  }

  getAx(): TrackEnd {
    return this.segment.getEnd(WhichEnd.A);
  }

  getBx(): TrackEnd {
    return this.segment.getEnd(WhichEnd.B);
  }

  // todo emit
  update(): void {
    this.renderer.update();
  }

  remove(): boolean {
    const removable = super.remove();
    if (removable) {
      this.renderer.remove();
      this.segment.remove();

      // todo emit
      this.store.unregister(this);
    }
    return removable;
  }

  // todo remove when possible
  getRenderer(): BaseRenderer {
    return this.renderer;
  }

  persist(): Object {
    return {
      id: this.getId(),
      type: 'Track'

      // segment: this.curve.persist()
    };
  }

  load(obj: any, store: Store): void {
    // this.presetId(obj.id);
    // this.init(obj.segment.map(a => new Coordinate(a.x, a.y, a.z)));
  }
}
