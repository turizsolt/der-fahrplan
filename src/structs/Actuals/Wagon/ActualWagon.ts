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
import { Updatable } from '../../../mixins/Updatable';
import { applyMixins } from '../../../mixins/ApplyMixins';
import { ActualBaseBrick } from '../ActualBaseBrick';
import { Train } from '../../Scheduling/Train';
import { Trip } from '../../Scheduling/Trip';
import { WagonPosition } from './WagonPosition';
import { BoardableWagon } from '../../../mixins/BoardableWagon';

export interface ActualWagon extends Updatable {}
const doApply = () => applyMixins(ActualWagon, [Updatable]);
@injectable()
export class ActualWagon extends ActualBaseBrick implements Wagon {
  private removed: boolean = false;
  protected worm: TrackWorm;
  protected trip: Route;
  protected train: Train;

  protected position: WagonPosition;
  protected boardable: BoardableWagon;

  @inject(TYPES.WagonRenderer) private renderer: WagonRenderer;

  init(): Wagon {
    super.initStore(TYPES.Wagon);

    this.position = new WagonPosition(this, this.worm);
    this.boardable = new BoardableWagon(this);
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

  announceStoppedAt(platform: Platform): void {
    const station = platform.getStation();
    this.getBoardedPassengers().map(p => {
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

  getWorm(): TrackWorm {
    return this.worm;
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

  getRenderer(): BaseRenderer {
    return this.renderer;
  }

  update() {
    this.renderer.update();

    const deep = this.persistDeep();
    this.notify(deep);
  }

  ///////////////////////////
  // boardable
  ///////////////////////////

  hasFreeSeat(): boolean {
    return this.boardable.hasFreeSeat();
  }

  setSeatCount(count: number, columns: number) {
    this.boardable.setSeatCount(count, columns);
  }

  board(passenger: Passenger): Coordinate {
    return this.boardable.board(passenger);
  }

  moveBoardedPassengers() {
    this.boardable.moveBoardedPassengers();
  }

  unboard(passenger: Passenger): void {
    this.boardable.unboard(passenger);
  }

  getBoardedPassengers(): Passenger[] {
    return this.boardable.getBoardedPassengers();
  }

  ///////////////////////////
  // position
  ///////////////////////////

  getCenterPos(): Coordinate {
    return this.position.getCenterPos();
  }

  getCenterRay(): Ray {
    return this.position.getCenterRay();
  }

  getLength(): number {
    return this.position.getLength();
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

  ///////////////////////
  // persist
  ///////////////////////

  persist(): Object {
    return {
      id: this.id,
      type: 'Wagon',

      ...this.boardable.persist(),

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
    this.boardable.load(obj.seats, store);

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
}

doApply();
