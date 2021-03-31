import { TrackEnd } from './TrackEnd';
import { TrackRenderer } from '../../structs/Renderers/TrackRenderer';
import { TYPES } from '../../di/TYPES';
import { Coordinate } from '../../structs/Geometry/Coordinate';
import { Track } from './Track';
import { ActualTrackBase } from './ActualTrackBase';
import { injectable, inject } from 'inversify';
import { WhichEnd } from '../../structs/Interfaces/WhichEnd';
import { BaseRenderer } from '../../structs/Renderers/BaseRenderer';
import { Store } from '../../structs/Interfaces/Store';
import { ActualTrackSegment } from './ActualTrackSegment';
import { TrackCurve } from './TrackCurve';
import { ActualTrackEnd } from './ActualTrackEnd';
import { TrackJointEnd } from './TrackJoint/TrackJointEnd';

@injectable()
export class ActualTrack extends ActualTrackBase implements Track {
  protected A: TrackEnd;
  protected B: TrackEnd;
  protected segment: ActualTrackSegment;

  @inject(TYPES.TrackRenderer) private renderer: TrackRenderer;

  init(coordinates: Coordinate[], joints: TrackJointEnd[]): Track {
    super.initStore(TYPES.Track);

    // todo remove when possible
    this.A = new TrackEnd(WhichEnd.A, this);
    this.B = new TrackEnd(WhichEnd.B, this);
    this.curve = new TrackCurve(coordinates);

    this.segment = new ActualTrackSegment().init(this, coordinates, joints);

    // todo emit
    this.renderer.init(this);
    return this;
  }

  getAx(): ActualTrackEnd {
    return this.segment.getEnd(WhichEnd.A);
  }

  getBx(): ActualTrackEnd {
    return this.segment.getEnd(WhichEnd.B);
  }

  // todo emit
  update(): void {
    this.renderer.update();
  }

  remove(): boolean {
    const removable = super.remove();
    if (removable) {
      this.A.remove();
      this.B.remove();
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
      type: 'Track',

      segment: this.curve.persist()
    };
  }

  load(obj: any, store: Store): void {
    // this.presetId(obj.id);
    // this.init(obj.segment.map(a => new Coordinate(a.x, a.y, a.z)));
  }
}
