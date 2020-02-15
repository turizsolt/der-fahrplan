import { TrackEnd } from './TrackEnd';
import { TrackSegment } from '../TrackBase/TrackSegment';
import { TrackRenderer } from './TrackRenderer';
import { TYPES } from '../TYPES';
import { Coordinate } from '../Geometry/Coordinate';
import { Track } from './Track';
import { ActualTrackBase } from '../TrackBase/ActualTrackBase';
import { injectable, inject } from 'inversify';
import { WhichEnd } from './WhichEnd';
import { Store } from '../Store/Store';

@injectable()
export class ActualTrack extends ActualTrackBase implements Track {
  protected A: TrackEnd;
  protected B: TrackEnd;
  protected segment: TrackSegment;
  @inject(TYPES.TrackRenderer) private renderer: TrackRenderer;

  @inject(TYPES.FactoryOfStore) StoreFactory: () => Store;
  private store: Store;

  init(coordinates: Coordinate[]): Track {
    this.store = this.StoreFactory();
    this.id = this.store.register(this);

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
    // console.log('r T', this.getId(), this.isRemovable());
    const removable = super.remove();
    if (removable) {
      this.A.remove();
      this.B.remove();
      this.renderer.update();
    }
    return removable;
  }

  verbose(): void {
    console.log('track ', this.id, '(hash, conn,  joint)');
    console.log(
      'A ',
      this.A.getHash(),
      !!this.A.connectedToEnd && this.A.connectedToEnd.getHash(),
      !!this.A.getJointTo() && this.A.getJointTo().getId()
    );
    console.log(
      'B ',
      this.B.getHash(),
      !!this.B.connectedToEnd && this.B.connectedToEnd.getHash(),
      !!this.B.getJointTo() && this.B.getJointTo().getId()
    );
    console.log('/track');
  }
}
