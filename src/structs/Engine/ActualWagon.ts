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
import { TrackWorm } from './TrackWorm';

const WAGON_GAP: number = 1;

@injectable()
export class ActualWagon extends ActualBaseBrick implements Wagon {
  private removed: boolean = false;
  protected worm: TrackWorm;

  @inject(TYPES.WagonRenderer) private renderer: WagonRenderer;

  getLength(): number {
    return 14;
  }

  remove(): boolean {
    this.removed = true;
    this.worm.checkoutAll();
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
    //if (!track.isEmpty()) return false;

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
    this.ends.B.positionOnTrack.hop(this.getLength());

    const bTrack = this.ends.B.positionOnTrack.getTrack();
    if (track === bTrack) {
      this.worm = new TrackWorm([track], this);
    } else {
      this.worm = new TrackWorm([track, bTrack], this);
    }

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
    if (this.ends.B.hasConnectedEndOf()) return;

    this.ends.B.positionOnTrack.hop(distance);
    this.ends.A.positionOnTrack.copyFrom(this.ends.B.positionOnTrack);
    const newWorm = this.ends.A.positionOnTrack
      .hop(-this.getLength())
      .reverse();
    this.worm.moveForward(newWorm);
    this.update();

    if (this.ends.A.hasConnectedEndOf()) {
      const next = this.ends.A.getConnectedEndOf();
      next.pullForward(this.ends.A.positionOnTrack);
    }
  }

  pullForward(pot: PositionOnTrack) {
    this.getB().positionOnTrack.copyFrom(pot);
    this.getB().positionOnTrack.hop(-WAGON_GAP);
    this.getA().positionOnTrack.copyFrom(this.getB().positionOnTrack);
    const newWorm = this.getA()
      .positionOnTrack.hop(-this.getLength())
      .reverse();
    this.worm.moveForward(newWorm);
    this.update();

    if (this.ends.A.hasConnectedEndOf()) {
      const next = this.ends.A.getConnectedEndOf();
      next.pullForward(this.ends.A.positionOnTrack);
    }
  }

  backward(distance: number): void {
    if (this.ends.A.hasConnectedEndOf()) return;

    this.ends.A.positionOnTrack.hop(-distance);
    this.ends.B.positionOnTrack.copyFrom(this.ends.A.positionOnTrack);
    const newWorm = this.ends.B.positionOnTrack.hop(this.getLength());
    this.worm.moveBackward(newWorm);
    this.update();

    if (this.ends.B.hasConnectedEndOf()) {
      const next = this.ends.B.getConnectedEndOf();
      next.pullBackward(this.ends.B.positionOnTrack);
    }
  }

  pullBackward(pot: PositionOnTrack) {
    this.getA().positionOnTrack.copyFrom(pot);
    this.getA().positionOnTrack.hop(WAGON_GAP);
    this.getB().positionOnTrack.copyFrom(this.getA().positionOnTrack);
    const newWorm = this.getB().positionOnTrack.hop(this.getLength());
    this.worm.moveBackward(newWorm);
    this.update();

    if (this.ends.B.hasConnectedEndOf()) {
      const next = this.ends.B.getConnectedEndOf();
      next.pullBackward(this.ends.B.positionOnTrack);
    }
  }
}

export class WagonEnd extends End<Wagon> {
  public positionOnTrack: PositionOnTrack;

  getPositionOnTrack() {
    return this.positionOnTrack;
  }
}
