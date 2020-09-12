import { inject, injectable } from 'inversify';
import { PositionOnTrack } from '../Track/PositionOnTrack';
import { BaseRenderer } from '../../Renderers/BaseRenderer';
import { WhichEnd } from '../../Interfaces/WhichEnd';
import { Wagon, NearestWagon } from '../../Interfaces/Wagon';
import { Ray } from '../../Geometry/Ray';
import { TYPES } from '../../../di/TYPES';
import { WagonRenderer } from '../../Renderers/WagonRenderer';
import { TrackBase } from '../../Interfaces/TrackBase';
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
import { Trip } from '../../Scheduling/Trip';
import { WagonPosition } from './WagonPosition';

export interface ActualWagon extends Updatable, Boardable {}
const doApply = () => applyMixins(ActualWagon, [Updatable, Boardable]);
@injectable()
export class ActualWagon extends ActualBaseBrick implements Wagon {
  private removed: boolean = false;
  protected worm: TrackWorm;
  protected trip: Route;
  protected train: Train;

  protected position: WagonPosition;

  @inject(TYPES.WagonRenderer) private renderer: WagonRenderer;

  init(): Wagon {
    super.initStore(TYPES.Wagon);

    this.position = new WagonPosition(this, this.worm);
    this.train = this.store.create<Train>(TYPES.Train).init(this);

    return this;
  }

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

  cancelTrip(): void {
    this.train.cancelTrip();
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
    const trackA = this.getA().positionOnTrack.getTrack();
    platformsInvolved.push(
      ...trackA
        .getPlatformsBeside()
        .filter(p => this.getA().positionOnTrack.isBeside(p))
    );
    const trackB = this.getB().positionOnTrack.getTrack();
    trackB
      .getPlatformsBeside()
      .filter(p => this.getB().positionOnTrack.isBeside(p))
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
    return this.position.getCenterPos();
  }

  getCenterRay(): Ray {
    return this.position.getCenterRay();
  }

  getLength(): number {
    return 14;
  }

  remove(): boolean {
    this.removed = true;
    this.worm.checkoutAll();
    this.position.remove();
    this.update();
    return true;
  }
  isRemoved(): boolean {
    return this.removed;
  }

  getA(): WagonEnd {
    return this.position.getA();
  }

  getB(): WagonEnd {
    return this.position.getB();
  }

  getEnd(whichEnd: WhichEnd): WagonEnd {
    return this.position.getEnd(whichEnd);
  }

  getRenderer(): BaseRenderer {
    return this.renderer;
  }
  persist(): Object {
    return {
      id: this.id,
      type: 'Wagon',

      seatCount: this.seatCount,
      seatColumns: this.seatColumns,
      seats: this.seats.map(p => p && p.getId()),

      A: this.getA().persist(),
      B: this.getB().persist(),

      trip: this.trip && this.trip.getId(),
      train: this.train.getId()
    };
  }

  persistDeep(): Object {
    return {
      id: this.id,
      type: 'Wagon',

      trip: this.getTrip() && this.getTrip().persistDeep()
    };
  }

  load(obj: any, store: Store): void {
    this.presetId(obj.id);
    this.init();

    this.setSeatCount(obj.seatCount, obj.seatColumns);
    this.seats = obj.seats.map(s => (s ? store.get(s.id) : undefined));

    this.getA().load(obj.A, store);
    this.getB().load(obj.B, store);

    const track = this.getA().positionOnTrack.getTrack();
    const bTrack = this.getB().positionOnTrack.getTrack();
    if (track === bTrack) {
      this.worm = new TrackWorm([track], this);
    } else {
      this.worm = new TrackWorm([track, bTrack], this);
    }

    if (obj.trip) this.assignTrip(store.get(obj.trip) as Trip);

    this.renderer.init(this);
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
    this.worm = this.position.putOnTrack(track, position, direction);
    this.renderer.init(this);
    this.update();
  }

  getRay(): Ray {
    return this.position.getRay();
  }

  moveTowardsWagonB(distance: number): void {
    this.position.moveTowardsWagonB(distance);
    this.train.moveBoardedPassengers();
  }

  pullToPos(pot: PositionOnTrack, dir: number) {
    this.position.pullToPos(pot, dir);
  }

  moveTowardsWagonA(distance: number): void {
    this.position.moveTowardsWagonA(distance);
    this.train.moveBoardedPassengers();
  }

  getNearestWagon(whichEnd: WhichEnd): NearestWagon {
    return this.position.getNearestWagon(whichEnd);
  }

  swapEnds(): void {
    this.position.swapEnds();
  }
}

doApply();
