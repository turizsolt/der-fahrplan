import { inject, injectable } from 'inversify';
import { PositionOnTrack } from './PositionOnTrack';
import { ActualBaseBrick } from '../Base/ActualBaseBrick';
import { BaseRenderer } from '../Base/BaseRenderer';
import { Store } from '../Store/Store';
import { WhichEnd } from '../Track/WhichEnd';
import { End } from '../Track/End';
import { Wagon } from './Wagon';
import { Ray } from '../Geometry/Ray';
import { TYPES } from '../TYPES';
import { WagonRenderer } from './WagonRenderer';
import { TrackBase } from '../TrackBase/TrackBase';
import { LineSegment } from '../Geometry/LineSegment';

@injectable()
export class ActualWagon extends ActualBaseBrick implements Wagon {
  private removed: boolean = false;

  @inject(TYPES.WagonRenderer) private renderer: WagonRenderer;

  remove(): boolean {
    this.removed = true;
    this.update();
    return true;
  }
  isRemoved(): boolean {
    return this.removed;
  }
  init(): Wagon {
    super.initStore();

    this.ends = {
      [WhichEnd.A]: new WagonEnd(WhichEnd.A, this),
      [WhichEnd.B]: new WagonEnd(WhichEnd.B, this)
    };

    return this;
  }

  getA(): WagonEnd {
    return this.ends.A;
  }

  getB(): WagonEnd {
    return this.ends.B;
  }

  private ends: Record<WhichEnd, WagonEnd>;

  getRenderer(): BaseRenderer {
    return this.renderer;
  }
  persist(): Object {
    throw new Error('Method not implemented.');
  }
  load(obj: Object, store: Store): void {
    throw new Error('Method not implemented.');
  }
  update() {
    this.renderer.update();
  }

  putOnTrack(
    track: TrackBase,
    position: number = 0,
    direction: number = 1
  ): void {
    this.ends.A.positionOnTrack = new PositionOnTrack(
      track,
      null,
      position,
      direction
    );

    this.ends.B.positionOnTrack = new PositionOnTrack(
      track,
      null,
      position,
      direction
    );

    this.ends.B.positionOnTrack.copyFrom(this.ends.A.positionOnTrack);
    this.ends.B.positionOnTrack.hop(14);

    track.checkin(null);

    this.renderer.init(this);
    this.update();
  }

  getRay(): Ray {
    const ls = LineSegment.fromTwoPoints(
      this.ends.A.positionOnTrack.getRay().coord,
      this.ends.B.positionOnTrack.getRay().coord
    );
    return ls.getPointAtHalfway();
  }

  forward(distance: number): void {
    this.ends.B.positionOnTrack.hop(distance);
    this.ends.A.positionOnTrack.copyFrom(this.ends.B.positionOnTrack);
    this.ends.A.positionOnTrack.hop(-14);
    this.update();
  }

  backward(distance: number): void {
    this.ends.A.positionOnTrack.hop(-distance);
    this.ends.B.positionOnTrack.copyFrom(this.ends.A.positionOnTrack);
    this.ends.B.positionOnTrack.hop(14);
    this.update();
  }
}

export class WagonEnd extends End<Wagon> {
  public positionOnTrack: PositionOnTrack;

  getPositionOnTrack() {
    return this.positionOnTrack;
  }
}
