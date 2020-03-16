import { inject, injectable } from 'inversify';
import { PositionOnTrack } from './PositionOnTrack';
import { ActualBaseBrick } from '../Base/ActualBaseBrick';
import { BaseRenderer } from '../Base/BaseRenderer';
import { Store } from '../Store/Store';
import { WhichEnd } from '../Track/WhichEnd';
import { End } from '../Track/End';
import { Wagon, NearestWagon } from './Wagon';
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
    this.ends.A.disconnect();
    this.ends.B.disconnect();
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

  moveTowardsWagonB(distance: number): void {
    if (this.ends.B.hasConnectedEndOf()) return;

    const initDist = this.getB()
      .getPositionOnTrack()
      .getRay()
      .coord.distance2d(
        this.getA()
          .getPositionOnTrack()
          .getRay().coord
      );

    this.ends.B.positionOnTrack.hop(distance);

    const newDist = this.getB()
      .getPositionOnTrack()
      .getRay()
      .coord.distance2d(
        this.getA()
          .getPositionOnTrack()
          .getRay().coord
      );

    let inv = 1;
    if (newDist < initDist) {
      this.ends.B.positionOnTrack.hop(-distance);
      this.ends.B.positionOnTrack.hop(-distance);
      inv = -1;
    }

    this.ends.A.positionOnTrack.copyFrom(this.ends.B.positionOnTrack);
    const newWorm = this.ends.A.positionOnTrack
      .hop(-1 * inv * this.getLength())
      .reverse();
    this.worm.moveForward(newWorm);
    this.update();

    if (this.ends.A.hasConnectedEndOf()) {
      const next = this.ends.A.getConnectedEndOf();
      next.pullToPos(this.ends.A.positionOnTrack, -1 * inv);
    }

    const nearest = this.getNearestWagon(WhichEnd.B);
    if (nearest) {
      const dist = nearest.end
        .getPositionOnTrack()
        .getRay()
        .coord.distance2d(this.ends.B.getPositionOnTrack().getRay().coord);

      if (dist <= 1) {
        this.ends.B.connect(nearest.end);
      }
    }
  }

  pullToPos(pot: PositionOnTrack, dir: number) {
    const isACloser =
      this.getA()
        .getPositionOnTrack()
        .getRay()
        .coord.distance2d(pot.getRay().coord) <
      this.getB()
        .getPositionOnTrack()
        .getRay()
        .coord.distance2d(pot.getRay().coord);
    const closer = isACloser ? this.getA() : this.getB();
    const further = isACloser ? this.getB() : this.getA();

    closer.positionOnTrack.copyFrom(pot);
    closer.positionOnTrack.hop(dir * WAGON_GAP);
    further.positionOnTrack.copyFrom(closer.positionOnTrack);
    const newWorm = further.positionOnTrack.hop(dir * this.getLength());
    this.worm.moveBackward(newWorm);
    this.update();

    if (further.hasConnectedEndOf()) {
      const next = further.getConnectedEndOf();
      next.pullToPos(further.positionOnTrack, dir); // or -dir
    }
  }

  moveTowardsWagonA(distance: number): void {
    if (this.ends.A.hasConnectedEndOf()) return;

    const initDist = this.getB()
      .getPositionOnTrack()
      .getRay()
      .coord.distance2d(
        this.getA()
          .getPositionOnTrack()
          .getRay().coord
      );

    this.ends.A.positionOnTrack.hop(-distance);

    const newDist = this.getB()
      .getPositionOnTrack()
      .getRay()
      .coord.distance2d(
        this.getA()
          .getPositionOnTrack()
          .getRay().coord
      );

    let inv = 1;
    if (newDist < initDist) {
      this.ends.A.positionOnTrack.hop(distance);
      this.ends.A.positionOnTrack.hop(distance);
      inv = -1;
    }

    this.ends.B.positionOnTrack.copyFrom(this.ends.A.positionOnTrack);
    const newWorm = this.ends.B.positionOnTrack.hop(inv * this.getLength());
    this.worm.moveBackward(newWorm);
    this.update();

    // move some wagons behind be (on B end)
    if (this.ends.B.hasConnectedEndOf()) {
      const next = this.ends.B.getConnectedEndOf();
      next.pullToPos(this.ends.B.positionOnTrack, 1 * inv);
    }

    const nearest = this.getNearestWagon(WhichEnd.A);
    if (nearest) {
      const dist = nearest.end
        .getPositionOnTrack()
        .getRay()
        .coord.distance2d(this.ends.A.getPositionOnTrack().getRay().coord);

      if (dist <= 1) {
        this.ends.A.connect(nearest.end);
      }
    }
  }

  getNearestWagon(whichEnd: WhichEnd): NearestWagon {
    const end = whichEnd === WhichEnd.A ? this.getA() : this.getB();

    const track = end.positionOnTrack.getTrack();

    let to = 0;
    if (end.positionOnTrack.getDirection() === 1) {
      to = whichEnd === WhichEnd.A ? 0 : 1;
    } else {
      to = whichEnd === WhichEnd.A ? 1 : 0;
    }

    return track.getWagonClosest(
      end.positionOnTrack.getPercentage(),
      to,
      this,
      2
    );
  }

  swapEnds(): void {
    if (this.getA().hasConnectedEndOf() || this.getB().hasConnectedEndOf())
      return;

    const [tmpA, tmpB] = [this.getA(), this.getB()];
    this.ends = { A: tmpB, B: tmpA };
    this.getA().swapDirection();
    this.getB().swapDirection();
  }
}

export class WagonEnd extends End<Wagon> {
  public positionOnTrack: PositionOnTrack;

  getPositionOnTrack() {
    return this.positionOnTrack;
  }

  getConnectedEnd(): WagonEnd {
    return this.connectedEnd as WagonEnd;
  }

  isSwitchingDirections(): boolean {
    if (!this.getConnectedEnd()) return null;
    return (
      this.getPositionOnTrack().getDirection() !==
      this.getConnectedEnd()
        .getPositionOnTrack()
        .getDirection()
    );
  }

  swapDirection() {
    this.positionOnTrack.swapDirection();
    this.whichEnd = this.whichEnd === WhichEnd.A ? WhichEnd.B : WhichEnd.A;
  }
}
