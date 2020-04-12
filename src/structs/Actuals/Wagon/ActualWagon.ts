import { inject, injectable } from 'inversify';
import { PositionOnTrack } from '../Track/PositionOnTrack';
import { BaseRenderer } from '../../Renderers/BaseRenderer';
import { WhichEnd } from '../../Interfaces/WhichEnd';
import { Wagon, NearestWagon } from '../../Interfaces/Wagon';
import { Ray } from '../../Geometry/Ray';
import { TYPES } from '../../../di/TYPES';
import { WagonRenderer } from '../../Renderers/WagonRenderer';
import { TrackBase } from '../../Interfaces/TrackBase';
import { LineSegment } from '../../Geometry/LineSegment';
import { TrackWorm } from '../Track/TrackWorm';
import { WagonEnd } from './WagonEnd';
import { Store } from '../../Interfaces/Store';
import { Route } from '../../Scheduling/Route';
import { Platform } from '../../Interfaces/Platform';
import { Passenger } from '../../Interfaces/Passenger';
import { Coordinate } from '../../Geometry/Coordinate';
import { Left } from '../../Geometry/Directions';
import { Updatable } from '../../../mixins/Updatable';
import { applyMixins } from '../../../mixins/ApplyMixins';
import { Boardable } from '../../../mixins/Boardable';
import { ActualBaseBrick } from '../ActualBaseBrick';
import { Train } from '../../Scheduling/Train';

const WAGON_GAP: number = 1;

export interface ActualWagon extends Updatable, Boardable {}
const doApply = () => applyMixins(ActualWagon, [Updatable, Boardable]);
@injectable()
export class ActualWagon extends ActualBaseBrick implements Wagon {
  private removed: boolean = false;
  protected worm: TrackWorm;
  protected trip: Route;
  protected train: Train;

  @inject(TYPES.WagonRenderer) private renderer: WagonRenderer;

  assignTrip(route: Route): void {
    const oldTrip = this.getTrip();
    if (oldTrip) {
      for (let stop of oldTrip.getStops()) {
        stop.getStation().deannounce(oldTrip);
      }
    }
    this.trip = route;
    if (route) {
      this.train.setSchedulingWagon(this);
    }
    const newTrip = this.getTrip();
    if (newTrip) {
      for (let stop of newTrip.getStops()) {
        stop.getStation().announce(newTrip);
      }
    }
    this.update();
  }

  getTrain(): Train {
    return this.train;
  }

  setTrain(train: Train): void {
    if (train) {
      this.train = train;
    } else {
      this.train = this.store.create<Train>(TYPES.Train).init(this);
    }
  }

  getTrip(): Route {
    if (this.trip) return this.trip;
    if (this.getTrain().getSchedulingWagon() !== this)
      return this.getTrain().getTrip();
    return null;
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
    this.train.stoppedAt(platform.getStation(), platform);
  }

  hasFreeSeat(): boolean {
    return this.seatCount > this.passengerCount;
  }

  announceStoppedAt(platform: Platform): void {
    const station = platform.getStation();
    this.seats.map(p => {
      if (p) {
        p.listenWagonStoppedAtAnnouncement(
          station,
          platform,
          this.train,
          this.trip
        );
      }
    });
  }

  private seatCount: number = 21;
  private seatColumns: number = 3;
  private passengerCount: number = 0;
  private seats: Passenger[] = [];

  setSeatCount(count: number, columns: number = 3) {
    this.seatCount = count;
    this.seatColumns = columns;
  }

  board(passenger: Passenger): Coordinate {
    if (this.passengerCount >= this.seatCount) {
      return null;
    }

    this.passengerCount += 1;
    let seatNo: number;
    do {
      seatNo = (Math.random() * this.seatCount) | 0;
    } while (this.seats[seatNo]);
    this.seats[seatNo] = passenger;
    const ray = this.seatOffset(seatNo);
    return ray && ray.coord;
  }

  moveBoardedPassengers() {
    this.seats.map((pass, seatNo) => {
      if (pass) {
        pass.updatePos(this.seatOffset(seatNo).coord);
      }
    });
  }

  private seatOffset(seatNo) {
    if (!this.worm || this.worm.getAll().length === 0) return null;

    const colSize = 1.2;
    const rowSize = 1.2;
    const colCount = this.seatColumns - 1;
    const rowCount = Math.ceil(this.seatCount / (colCount + 1)) - 1;

    const col = seatNo % 3;
    const row = (seatNo - col) / 3;
    return this.getCenterRay()
      .fromHere(Left, -((colCount / 2) * colSize) + col * colSize)
      .fromHere(0, (rowCount / 2) * rowSize - row * rowSize);
  }

  unboard(passenger: Passenger): void {
    const seatNo = this.seats.findIndex(x => x === passenger);
    if (seatNo !== -1) {
      this.seats[seatNo] = undefined;
      this.passengerCount -= 1;
    }
  }

  getBoardedPassengers(): Passenger[] {
    return this.seats.filter(x => x);
  }

  getCenterPos(): Coordinate {
    return this.ends.A.positionOnTrack
      .getRay()
      .coord.midpoint(this.ends.B.positionOnTrack.getRay().coord);
  }

  getCenterRay(): Ray {
    return new Ray(
      this.getCenterPos(),
      this.ends.A.positionOnTrack.getRay().dirXZ
    );
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

    this.train = this.store.create<Train>(TYPES.Train).init(this);

    return this;
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

    const deep = this.persistDeep();
    this.notify(deep);
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

    this.moveBoardedPassengers();
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

    this.moveBoardedPassengers();
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

doApply();
