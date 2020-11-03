import { TrackEnd } from './TrackEnd';
import { TrackSegment } from './TrackSegment';
import { TrackRenderer } from '../../Renderers/TrackRenderer';
import { TYPES } from '../../../di/TYPES';
import { Coordinate } from '../../Geometry/Coordinate';
import { Track } from '../../Interfaces/Track';
import { ActualTrackBase } from './ActualTrackBase';
import { injectable, inject } from 'inversify';
import { WhichEnd } from '../../Interfaces/WhichEnd';
import { BaseRenderer } from '../../Renderers/BaseRenderer';
import { Store } from '../../Interfaces/Store';

@injectable()
export class ActualTrack extends ActualTrackBase implements Track {
  protected A: TrackEnd;
  protected B: TrackEnd;
  protected segment: TrackSegment;
  @inject(TYPES.TrackRenderer) private renderer: TrackRenderer;

  init(coordinates: Coordinate[]): Track {
    super.initStore(TYPES.Track);

    this.A = new TrackEnd(WhichEnd.A, this);
    this.B = new TrackEnd(WhichEnd.B, this);
    this.segment = new TrackSegment(coordinates);
    this.renderer.init(this);
    return this;
  }

  update(): void {
    this.renderer.update();
  }

  remove(): boolean {
    const removable = super.remove();
    if (removable) {
      this.A.remove();
      this.B.remove();
      this.renderer.remove();

      this.store.unregister(this);
    }
    return removable;
  }

  verbose(): void {
    this.update();
    // console.log('track ', this.id, '(hash, conn,  joint)');
    // console.log(
    //   'A ',
    //   this.A.getHash(),
    //   !!this.A.getConnectedEnd() && this.A.getConnectedEnd().getHash(),
    //   !!this.A.getConnectedEndOf() && this.A.getConnectedEndOf().getId(),
    //   !!this.A.getJointTo() && this.A.getJointTo().getId()
    // );
    // console.log(
    //   'B ',
    //   this.B.getHash(),
    //   !!this.B.getConnectedEnd() && this.B.getConnectedEnd().getHash(),
    //   !!this.B.getConnectedEndOf() && this.B.getConnectedEndOf().getId(),
    //   !!this.B.getJointTo() && this.B.getJointTo().getId()
    // );
    // console.log('/track');
  }

  getRenderer(): BaseRenderer {
    return this.renderer;
  }

  persist(): Object {
    return {
      id: this.getId(),
      type: 'Track',

      segment: this.segment.persist()
    };
  }

  load(obj: any, store: Store): void {
    this.presetId(obj.id);
    this.init(obj.segment.map(a => new Coordinate(a.x, a.y, a.z)));
  }
}
