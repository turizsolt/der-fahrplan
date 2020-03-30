import { inject, injectable } from 'inversify';
import { PositionOnTrack } from '../Track/PositionOnTrack';
import { ActualBaseBrick } from '../ActualBaseBrick';
import { BaseRenderer } from '../../Renderers/BaseRenderer';
import { WhichEnd } from '../../Interfaces/WhichEnd';
import { Wagon, NearestWagon } from '../../Interfaces/Wagon';
import { Ray } from '../../Geometry/Ray';
import { TYPES } from '../../TYPES';
import { WagonRenderer } from '../../Renderers/WagonRenderer';
import { TrackBase } from '../../Interfaces/TrackBase';
import { LineSegment } from '../../Geometry/LineSegment';
import { TrackWorm } from '../Track/TrackWorm';
import { WagonEnd } from './WagonEnd';
import { Store } from '../../Interfaces/Store';
import { Route } from '../../Scheduling/Route';
import { Platform } from '../../Interfaces/Platform';
import { Passenger } from '../../Interfaces/Passenger';
import { ActualBaseBoardable } from '../ActualBaseBoardable';

const WAGON_GAP: number = 1;

@injectable()
export class ActualWagon extends ActualBaseBoardable implements Wagon {
  private removed: boolean = false;
  protected worm: TrackWorm;
  protected trip: Route;

  @inject(TYPES.WagonRenderer) private renderer: WagonRenderer;

  assignTrip(route: Route): void {
    this.trip = route;
    for (let stop of this.trip.getStops()) {
      stop.getStation().announce(this.trip);
    }
  }

  getTrip(): Route {
    return this.trip;
  }

  stop(): void {
    // todo use the worm
    const platformsInvolved: Platform[] = [];
    const trackA = this.ends.A.positionOnTrack.getTrack();
    platformsInvolved.push(
      ...trackA
        .getPlatformsBeside()
        .filter(p => this.ends.A.positionOnTrack.isBeside(p))
    );
    const trackB = this.ends.B.positionOnTrack.getTrack();
    trackB
      .getPlatformsBeside()
      .filter(p => this.ends.B.positionOnTrack.isBeside(p))
      .map((p: Platform) => {
        if (!platformsInvolved.find(x => x === p)) {
          platformsInvolved.push(p);
        }
      });

    platformsInvolved.map(p => this.stoppedAt(p));
  }

  stoppedAt(platform: Platform): void {
    console.log(
      `stopped at ${platform.getId()} of ${platform.getStation()!.getName()}`
    );
    if (platform.getStation()) {
      platform.getStation().announceArrived(this, platform, this.trip);
    }
    this.announceStoppedAt(platform);
  }

  announceStoppedAt(platform: Platform): void {
    const station = platform.getStation();
    this.boardedPassengers.map(p => {
      p.listenWagonStoppedAtAnnouncement(station, platform, this, this.trip);
    });
  }

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
    super.initStore(TYPES.Wagon);

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
    return {
      id: this.id,
      type: 'Wagon',

      // todo A, B ends
      trip: this.trip && this.trip.getId()
    };
  }

  persistDeep(): Object {
    return {
      id: this.id,
      type: 'Wagon',

      // todo A, B ends
      trip: this.trip && this.trip.persistDeep()
    };
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
