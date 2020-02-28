import { TrackEnd } from './TrackEnd';
import { TrackSegment } from '../TrackBase/TrackSegment';
import { TrackRenderer } from './TrackRenderer';
import { TYPES } from '../TYPES';
import { Coordinate } from '../Geometry/Coordinate';
import { Track } from './Track';
import { ActualTrackBase } from '../TrackBase/ActualTrackBase';
import { injectable, inject } from 'inversify';
import { WhichEnd } from './WhichEnd';
import { BaseRenderer } from '../Base/BaseRenderer';

@injectable()
export class ActualTrack extends ActualTrackBase implements Track {
  protected A: TrackEnd;
  protected B: TrackEnd;
  protected segment: TrackSegment;
  @inject(TYPES.TrackRenderer) private renderer: TrackRenderer;

  init(coordinates: Coordinate[]): Track {
    super.initStore();

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
      this.renderer.update();
    }
    return removable;
  }

  verbose(): void {
    this.update();
    console.log('track ', this.id, '(hash, conn,  joint)');
    console.log(
      'A ',
      this.A.getHash(),
      !!this.A.getConnectedEnd() && this.A.getConnectedEnd().getHash(),
      !!this.A.getConnectedTrack() && this.A.getConnectedTrack().getId(),
      !!this.A.getJointTo() && this.A.getJointTo().getId()
    );
    console.log(
      'B ',
      this.B.getHash(),
      !!this.B.getConnectedEnd() && this.B.getConnectedEnd().getHash(),
      !!this.B.getConnectedTrack() && this.B.getConnectedTrack().getId(),
      !!this.B.getJointTo() && this.B.getJointTo().getId()
    );
    console.log('/track');
  }

  getRenderer(): BaseRenderer {
    return this.renderer;
  }
}
