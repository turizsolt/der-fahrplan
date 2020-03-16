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
      if (this.ends.A.isSwitchingEnds()) {
        next.pullForward(this.ends.A.positionOnTrack);
      } else {
        next.pullBackward(this.ends.A.positionOnTrack);
      }
    }

    const nearest = this.getNearestWagon(WhichEnd.B);
    console.log(nearest && nearest.distance);
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
      if (this.ends.A.isSwitchingEnds()) {
        next.pullForward(this.ends.A.positionOnTrack);
      } else {
        next.pullBackward(this.ends.A.positionOnTrack);
      }
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
      if (this.ends.B.isSwitchingEnds()) {
        next.pullBackward(this.ends.B.positionOnTrack);
      } else {
        next.pullForward(this.ends.B.positionOnTrack);
      }
    }

    const nearest = this.getNearestWagon(WhichEnd.A);
    console.log(nearest && nearest.distance);
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

  pullBackward(pot: PositionOnTrack) {
    this.getA().positionOnTrack.copyFrom(pot);
    this.getA().positionOnTrack.hop(WAGON_GAP);
    this.getB().positionOnTrack.copyFrom(this.getA().positionOnTrack);
    const newWorm = this.getB().positionOnTrack.hop(this.getLength());
    this.worm.moveBackward(newWorm);
    this.update();

    if (this.ends.B.hasConnectedEndOf()) {
      const next = this.ends.B.getConnectedEndOf();
      if (this.ends.B.isSwitchingEnds()) {
        next.pullBackward(this.ends.B.positionOnTrack);
      } else {
        next.pullForward(this.ends.B.positionOnTrack);
      }
    }
  }

  getNearestWagon(whichEnd: WhichEnd): NearestWagon {
    const end = whichEnd === WhichEnd.A ? this.getA() : this.getB();

    console.log('============');

    const track = end.positionOnTrack.getTrack();

    // let to = 0;
    // const worm = this.worm.getAll();
    // if (worm.length === 1) {
    //   if (
    //     this.getA().positionOnTrack.getPercentage() <
    //     this.getB().positionOnTrack.getPercentage()
    //   ) {
    //     to = whichEnd === WhichEnd.A ? 0 : 1;
    //   } else {
    //     to = whichEnd === WhichEnd.A ? 1 : 0;
    //   }
    // }
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
}

export class WagonEnd extends End<Wagon> {
  public positionOnTrack: PositionOnTrack;

  getPositionOnTrack() {
    return this.positionOnTrack;
  }
}
