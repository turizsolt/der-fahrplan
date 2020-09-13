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
import { WagonAnnouncement } from './WagonAnnouncement';
import WagonEngine from '../../NewOne/WagonEngine';

export interface ActualWagon extends Updatable {}
const doApply = () => applyMixins(ActualWagon, [Updatable]);
@injectable()
export class ActualWagon extends ActualBaseBrick implements Wagon {
  private removed: boolean = false;
  protected worm: TrackWorm;

  protected position: WagonPosition;
  protected boardable: BoardableWagon;
  protected announcement: WagonAnnouncement;
  protected control: WagonControl;

  @inject(TYPES.WagonRenderer) private renderer: WagonRenderer;

  init(): Wagon {
    super.initStore(TYPES.Wagon);

    this.position = new WagonPosition(this);
    this.boardable = new BoardableWagon(this);
    this.announcement = new WagonAnnouncement(this, this.store);
    this.control = new WagonEngine(3);

    return this;
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
  // announcement
  ///////////////////////////

  getTrain(): Train {
    return this.announcement.getTrain();
  }

  setTrain(train: Train): void {
    this.announcement.setTrain(train);
  }

  assignTrip(route: Route): void {
    this.announcement.assignTrip(route);
    this.update();
  }

  cancelTrip(): void {
    this.announcement.cancelTrip();
  }

  getTrip(): Route {
    return this.announcement.getTrip();
  }

  stop(): void {
    this.announcement.stop();
  }

  stoppedAt(platform: Platform): void {
    this.announcement.stoppedAt(platform);
  }

  announceStoppedAt(platform: Platform): void {
    this.announcement.announceStoppedAt(platform);
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
    this.getTrain().moveBoardedPassengers();
  }

  pullToPos(pot: PositionOnTrack, dir: number) {
    this.position.pullToPos(pot, dir);
  }

  moveTowardsWagonA(distance: number): void {
    this.position.moveTowardsWagonA(distance);
    this.getTrain().moveBoardedPassengers();
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

      ...this.announcement.persist()
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
