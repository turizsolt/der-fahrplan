import { injectable } from 'inversify';
import { PositionOnTrack } from '../../../modules/Track/PositionOnTrack';
import { WhichEnd } from '../../Interfaces/WhichEnd';
import { Wagon, NearestWagon } from '../../Interfaces/Wagon';
import { Ray } from '../../Geometry/Ray';
import { TrackBase } from '../../../modules/Track/TrackBase';
import { LineSegment } from '../../Geometry/LineSegment';
import { TrackWorm } from '../../../modules/Track/TrackWorm';
import { WagonEnd } from './WagonEnd';
import { Coordinate } from '../../Geometry/Coordinate';
import { WagonMovingState } from './WagonMovingState';

const WAGON_GAP: number = 1;
const DEFAULT_WAGON_LENGTH: number = 14;

@injectable()
export class WagonPosition {
  private ends: Record<WhichEnd, WagonEnd>;

  constructor(
    private parent: Wagon,
    private length: number = DEFAULT_WAGON_LENGTH
  ) {
    this.ends = {
      [WhichEnd.A]: new WagonEnd(WhichEnd.A, this.parent),
      [WhichEnd.B]: new WagonEnd(WhichEnd.B, this.parent)
    };
  }

  putOnTrack(
    track: TrackBase,
    position: number = 0,
    direction: number = 1
  ): TrackWorm {
    this.ends.A.positionOnTrack = new PositionOnTrack(
      track,
      position,
      direction
    );

    this.ends.B.positionOnTrack = new PositionOnTrack(
      track,
      position,
      direction
    );

    this.ends.B.positionOnTrack.copyFrom(this.ends.A.positionOnTrack);
    this.ends.B.positionOnTrack.hop(this.getLength());

    const bTrack = this.ends.B.positionOnTrack.getTrack();
    if (track === bTrack) {
      return new TrackWorm([track], this.parent);
    } else {
      return new TrackWorm([track, bTrack], this.parent);
    }
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

    const nearest = this.getNearestWagon(WhichEnd.B);
    if (nearest) {
      const dist = nearest.end
        .getPositionOnTrack()
        .getRay()
        .coord.distance2d(this.ends.B.getPositionOnTrack().getRay().coord);

      if (dist <= 1) {
        if (this.parent.getMovingState() === WagonMovingState.Moving) {
          this.parent.halt();
          this.ends.B.positionOnTrack.hop(-distance * inv);
          return;
        } else {
          this.ends.B.connect(nearest.end);
        }
      }
    }

    this.ends.A.positionOnTrack.copyFrom(this.ends.B.positionOnTrack);
    const newWorm = this.ends.A.positionOnTrack
      .hop(-1 * inv * this.getLength())
      .reverse();
    this.parent.getWorm().moveForward(newWorm);
    this.parent.update();

    if (this.ends.A.hasConnectedEndOf()) {
      const next = this.ends.A.getConnectedEndOf();
      next.pullToPos(this.ends.A.positionOnTrack, -1 * inv);
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
    this.parent.getWorm().moveBackward(newWorm);
    this.parent.update();

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

    const nearest = this.getNearestWagon(WhichEnd.A);
    if (nearest) {
      const dist = nearest.end
        .getPositionOnTrack()
        .getRay()
        .coord.distance2d(this.ends.A.getPositionOnTrack().getRay().coord);

      if (dist <= 1) {
        if (this.parent.getMovingState() === WagonMovingState.Moving) {
          this.parent.halt();
          this.ends.A.positionOnTrack.hop(distance * inv);
          return;
        } else {
          this.ends.A.connect(nearest.end);
        }
      }
    }

    this.ends.B.positionOnTrack.copyFrom(this.ends.A.positionOnTrack);
    const newWorm = this.ends.B.positionOnTrack.hop(inv * this.getLength());
    this.parent.getWorm().moveBackward(newWorm);
    this.parent.update();

    // move some wagons behind be (on B end)
    if (this.ends.B.hasConnectedEndOf()) {
      const next = this.ends.B.getConnectedEndOf();
      next.pullToPos(this.ends.B.positionOnTrack, 1 * inv);
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
      this.parent,
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

  //////////////////////////////////
  // getters
  //////////////////////////////////

  getCenterPos(): Coordinate {
    return this.ends.A.positionOnTrack
      .getRay()
      .coord.midpoint(this.ends.B.positionOnTrack.getRay().coord);
  }

  getCenterRay(): Ray {
    return new Ray(
      this.getCenterPos(),
      this.ends.A.positionOnTrack
        .getRay()
        .coord.whichDir2d(this.ends.B.positionOnTrack.getRay().coord)
    );
  }

  getLength(): number {
    return this.length;
  }

  getA(): WagonEnd {
    return this.ends.A;
  }

  getB(): WagonEnd {
    return this.ends.B;
  }

  getEnd(whichEnd: WhichEnd): WagonEnd {
    return this.ends[whichEnd];
  }

  getRay(): Ray {
    const ls = LineSegment.fromTwoPoints(
      this.ends.A.positionOnTrack.getRay().coord,
      this.ends.B.positionOnTrack.getRay().coord
    );
    return ls.getPointAtHalfway();
  }

  remove() {
    this.ends.A.disconnect();
    this.ends.B.disconnect();
  }
}
