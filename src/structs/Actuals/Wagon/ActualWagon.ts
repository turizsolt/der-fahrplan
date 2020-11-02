import { inject, injectable } from 'inversify';
import { PositionOnTrack } from '../Track/PositionOnTrack';
import { BaseRenderer } from '../../Renderers/BaseRenderer';
import { WhichEnd, otherEnd } from '../../Interfaces/WhichEnd';
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
import {
  BoardableWagon,
  PassengerArrangement
} from '../../../mixins/BoardableWagon';
import { WagonAnnouncement } from './WagonAnnouncement';
import WagonSpeed from './WagonSpeed';
import { WagonControlType } from './WagonControl/WagonControlType';
import { WagonConnectable } from './WagonConnectable';
import { WagonConfig } from './WagonConfig';
import { WagonControl } from './WagonControl/WagonControl';
import { WagonControlLocomotive } from './WagonControl/WagonControlLocomotive';
import { WagonControlControlCar } from './WagonControl/WagonControlControlCar';
import { WagonControlNothing } from './WagonControl/WagonControlNothing';
import WagonSpeedPassenger from './WagonSpeedPassenger';
import { WagonMovingState } from './WagonMovingState';

export interface ActualWagon extends Updatable {}
const doApply = () => applyMixins(ActualWagon, [Updatable]);
@injectable()
export class ActualWagon extends ActualBaseBrick implements Wagon {
  private removed: boolean = false;
  protected worm: TrackWorm;

  protected position: WagonPosition;
  protected boardable: BoardableWagon;
  protected announcement: WagonAnnouncement;
  protected speed: WagonSpeed;
  protected control: WagonControl;

  private appearanceId: string;

  @inject(TYPES.WagonRenderer) private renderer: WagonRenderer;

  init(config?: WagonConfig): Wagon {
    super.initStore(TYPES.Wagon);

    this.position = new WagonPosition(this, config && config.length);
    this.boardable = new BoardableWagon(
      this,
      config && config.passengerArrangement
    );
    this.announcement = new WagonAnnouncement(this, this.store);
    if (config && config.controlType === WagonControlType.Nothing) {
      this.speed = new WagonSpeedPassenger(
        this,
        (config && config.maxSpeed) || undefined,
        (config && config.accelerateBy) || undefined
      );
    } else {
      this.speed = new WagonSpeed(
        this,
        (config && config.maxSpeed) || undefined,
        (config && config.accelerateBy) || undefined
      );
    }

    if (!config || config.controlType === WagonControlType.Locomotive) {
      this.control = new WagonControlLocomotive(this);
    } else if (config.controlType === WagonControlType.ControlCar) {
      this.control = new WagonControlControlCar(this);
    } else {
      this.control = new WagonControlNothing();
    }

    this.appearanceId = config ? config.appearanceId : 'wagon';

    return this;
  }

  disconnect(whichEnd: WhichEnd): void {
    if (this.speed.getMovingState() === WagonMovingState.Moving) return;

    this.getEnd(whichEnd).disconnect();
  }

  getMovingState(): WagonMovingState {
    if (!this.getTrain().getControlingWagon()) {
      return WagonMovingState.Standing;
    }
    const controllingWagon = this.getTrain().getControlingWagon();

    if (controllingWagon === this) {
      return this.speed.getMovingState();
    } else {
      return controllingWagon.getMovingState();
    }
  }

  getLastWagon(whichEnd: WhichEnd): Wagon {
    let end = this.getEnd(whichEnd);
    while (end.hasConnectedEndOf()) {
      end = end.getConnectedEnd().getOppositeEnd();
    }
    return end.getEndOf();
  }

  private getLastWagonEnd(whichEnd: WhichEnd): WagonEnd {
    let end = this.getEnd(whichEnd);
    while (end.hasConnectedEndOf()) {
      end = end.getConnectedEnd().getOppositeEnd();
    }
    return end;
  }

  setControlingWagon(wagon: Wagon): void {
    this.getTrain().setControlingWagon(wagon);
  }

  getControlingWagon(): Wagon {
    return this.getTrain().getControlingWagon();
  }

  clearControlingWagon(): void {
    this.getTrain().clearControlingWagon();
  }

  canThisWagonControl(): boolean {
    const controlingWagon = this.getTrain().getControlingWagon();
    return !controlingWagon || controlingWagon === this;
  }

  reverseTrip(): void {
    const trip = this.getTrip();
    if (trip && trip.getReverse()) {
      this.assignTrip(trip.getReverse());
    }
  }

  getSpeed(): number {
    return this.speed.getSpeed();
  }

  tick(): void {
    this.speed.tick();
    if (this.getSpeed() !== 0) {
      if (this.speed.getMovingState() === WagonMovingState.Shunting) {
        const whichEnd = this.getSelectedSide() || WhichEnd.A;
        const shuntingTo = this.getSpeed() < 0 ? otherEnd(whichEnd) : whichEnd;
        const headingWagonEnd = this.getLastWagonEnd(shuntingTo);
        const headingWagon = headingWagonEnd.getEndOf();
        const headingWhichEnd = headingWagonEnd.getWhichEnd();
        headingWagon.moveTowardsWagon(
          headingWhichEnd,
          Math.abs(this.getSpeed())
        );
      } else {
        if (this.getSelectedSide() === WhichEnd.A) {
          this.moveTowardsWagonA(this.getSpeed());
        } else if (this.getSelectedSide() === WhichEnd.B) {
          this.moveTowardsWagonB(this.getSpeed());
        }
      }
    } else {
      this.update();
    }
  }

  accelerate(): void {
    this.speed.accelerate();
  }

  break(): void {
    this.speed.break();
  }

  shuntForward(): void {
    this.speed.shountForward();
  }

  shuntBackward(): void {
    this.speed.shountBackward();
  }

  detach(): void {
    if (this.getControlType() === WagonControlType.Nothing) return;
    if (!this.isOneFree()) return;

    this.getA().disconnect();
    this.getB().disconnect();
  }

  getMaxSpeed(): number {
    return this.speed.getMaxSpeed();
  }

  getAccelerateBy(): number {
    return this.speed.getAcceleateBy();
  }

  getControlType(): WagonControlType {
    return this.control.getControlType();
  }

  getPassengerArrangement(): PassengerArrangement {
    return this.boardable.getPassengerArrangement();
  }

  getAppearanceId(): string {
    return this.appearanceId;
  }

  getConnectable(A: WhichEnd): WagonConnectable {
    return WagonConnectable.Connectable;
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

  isAFree(): boolean {
    return !this.position.getA().hasConnectedEndOf();
  }

  isBFree(): boolean {
    return !this.position.getB().hasConnectedEndOf();
  }

  isOneFree(): boolean {
    return this.isAFree() !== this.isBFree(); // xor
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

  moveTowardsWagon(whichEnd: WhichEnd, distance: number): void {
    if (whichEnd === WhichEnd.A) {
      this.moveTowardsWagonA(distance);
    } else if (whichEnd === WhichEnd.B) {
      this.moveTowardsWagonB(distance);
    }
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
    this.update();
  }

  ///////////////////////
  // control
  ///////////////////////

  getSelectedSide(): WhichEnd | null {
    return this.control.getSelectedSide();
  }

  onSelectChanged(selected: boolean): void {
    this.control.onSelected(selected);
  }

  swapSelectedSide(): void {
    this.control.swapSelectedSide();
  }

  onStocked(): void {
    this.control.onStocked();
  }

  ///////////////////////
  // persist
  ///////////////////////

  persist(): Object {
    return {
      id: this.id,
      type: 'Wagon',

      ...this.boardable.persist(),

      config: {
        maxSpeed: this.getMaxSpeed(),
        accelerateBy: this.getAccelerateBy(),
        controlType: this.getControlType(),
        passengerArrangement: this.getPassengerArrangement(),
        appearanceId: this.getAppearanceId(),
        length: this.getLength(),
        connectable: {
          A: this.getConnectable(WhichEnd.A),
          B: this.getConnectable(WhichEnd.B)
        }
      },

      A: this.getA().persist(),
      B: this.getB().persist(),

      ...this.announcement.persist()
    };
  }

  persistDeep(): Object {
    return {
      id: this.id,
      type: 'Wagon',
      speed: this.getSpeed(),

      trip: this.getTrip() && this.getTrip().persistDeep()
    };
  }

  load(obj: any, store: Store): void {
    this.presetId(obj.id);
    this.init(obj.config);

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
