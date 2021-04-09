import { inject, injectable } from 'inversify';
import { BaseRenderer } from '../../Renderers/BaseRenderer';
import { WhichEnd } from '../../Interfaces/WhichEnd';
import { Wagon } from '../../Interfaces/Wagon';
import { Ray } from '../../Geometry/Ray';
import { TYPES } from '../../../di/TYPES';
import { WagonRenderer } from '../../Renderers/WagonRenderer';
import { Store } from '../../Interfaces/Store';
import { Platform } from '../../Interfaces/Platform';
import { Passenger } from '../../Interfaces/Passenger';
import { Coordinate } from '../../Geometry/Coordinate';
import { applyMixins } from '../../../mixins/ApplyMixins';
import { ActualBaseBrick } from '../ActualBaseBrick';
import {
  BoardableWagon,
  PassengerArrangement
} from '../../../mixins/BoardableWagon';
import { WagonAnnouncement } from './WagonAnnouncement';
import { WagonControlType } from './WagonControl/WagonControlType';
import { WagonConnectable } from './WagonConnectable';
import { WagonConfig } from './WagonConfig';
import { WagonControl } from './WagonControl/WagonControl';
import { WagonControlLocomotive } from './WagonControl/WagonControlLocomotive';
import { WagonControlControlCar } from './WagonControl/WagonControlControlCar';
import { WagonControlNothing } from './WagonControl/WagonControlNothing';
import { Trip } from '../../Scheduling/Trip';
import { WagonAxles } from '../../../modules/Train/WagonAxles';
import { ActualWagonAxles } from '../../../modules/Train/ActualWagonAxles';
import { PositionOnTrack } from '../../../modules/Train/PositionOnTrack';
import { Emitable } from '../../../mixins/Emitable';
import { LineSegment } from '../../Geometry/LineSegment';
import { WagonData } from '../../../modules/Train/WagonData';
import { Train } from '../../../modules/Train/Train';
import { Util } from '../../Util';

export interface ActualWagon extends Emitable { }
const doApply = () => applyMixins(ActualWagon, [Emitable]);
@injectable()
export class ActualWagon extends ActualBaseBrick implements Wagon {

  protected boardable: BoardableWagon;
  protected announcement: WagonAnnouncement;
  protected control: WagonControl;
  protected axles: WagonAxles;

  private appearanceId: string;

  @inject(TYPES.WagonRenderer) private renderer: WagonRenderer;

  init(config?: WagonConfig, train?: Train): Wagon {
    super.initStore(TYPES.Wagon);

    this.axles = new ActualWagonAxles();
    this.boardable = new BoardableWagon(
      this,
      config && config.passengerArrangement
    );
    this.announcement = new WagonAnnouncement(this, this.store, train);

    if (!config || config.controlType === WagonControlType.Locomotive) {
      this.control = new WagonControlLocomotive();
    } else if (config.controlType === WagonControlType.ControlCar) {
      this.control = new WagonControlControlCar();
    } else {
      this.control = new WagonControlNothing();
    }

    this.appearanceId = config ? config.appearanceId : 'wagon';

    // const deep = this.persistDeep();
    this.emit('init', {
        id: this.id,
        appearanceId: this.getAppearanceId(),
        ray: null
    }); //this.persistData());//Object.freeze(deep));

    return this;
  }

  setAxlePosition(whichEnd: WhichEnd, pot: PositionOnTrack): void {
    this.axles.setAxlePosition(whichEnd, pot);
  }

  getAxlePosition(whichEnd: WhichEnd): PositionOnTrack {
    return this.axles.getAxlePosition(whichEnd);
  }

  axleReverse(): void {
    return this.axles.reverse();
  }

  tick(): void {
      /*
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
    } */
    this.update();
  }

  getControlType(): WagonControlType {
    return this.control.getControlType();
  }

  getPassengerArrangement(): PassengerArrangement {
    return this.boardable.getPassengerArrangement();
  }

  getPassengerCount(): number {
    return this.boardable.getPassengerCount();
  }

  getAppearanceId(): string {
    return this.appearanceId;
  }

  getConnectable(A: WhichEnd): WagonConnectable {
    return WagonConnectable.Connectable;
  }

  remove(): boolean {
    this.emit('remove', this.id);
    return true;
  }

  getRenderer(): BaseRenderer {
    return this.renderer;
  }

  update() {
    //this.renderer.update();

    const deep = this.persistDeep();
    this.emit('update', this.persistData());
    this.emit('info', Object.freeze(deep));
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

  assignTrip(trip: Trip): void {
    this.announcement.assignTrip(trip);
    this.update();
  }

  setTrip(trip: Trip): void {
    this.announcement.setTrip(trip);
  }

  cancelTrip(): void {
    this.announcement.cancelTrip();
  }

  getTrip(): Trip {
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

  platformsBeside(): Platform[] {
    return this.announcement.platformsBeside();
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
    return this.getAxlePosition(WhichEnd.A)
      .getRay()
      .coord.midpoint(this.getAxlePosition(WhichEnd.B).getRay().coord);
  }

  getCenterRay(): Ray {
    return new Ray(
      this.getCenterPos(),
      this.getAxlePosition(WhichEnd.A)
        .getRay()
        .coord.whichDir2d(this.getAxlePosition(WhichEnd.B).getRay().coord)
    );
  }

  getLength(): number {
    return 14; // todo
  }

  getRay(): Ray {
    const ls = LineSegment.fromTwoPoints(
      this.getAxlePosition(WhichEnd.A).getRay().coord,
      this.getAxlePosition(WhichEnd.B).getRay().coord
    );
    return ls.getPointAtHalfway();
  }

  swapEnds(): void {
    // todo
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
        controlType: this.getControlType(),
        passengerArrangement: this.getPassengerArrangement(),
        appearanceId: this.getAppearanceId(),
        length: this.getLength(),
        connectable: {
          A: this.getConnectable(WhichEnd.A),
          B: this.getConnectable(WhichEnd.B)
        }
      },

      // A: this.getA().persist(),
      // B: this.getB().persist(),

      ...this.announcement.persist()
    };
  }

  persistDeep(): Object {
    return {
      id: this.id,
      type: 'Wagon',
      speed: this.getTrain()?.getSpeed()?.getSpeed(),
      train: this.getTrain()?.persistDeep(),
      trip: this.getTrip()?.persistDeep(),
      nearestEnd: this.getTrain()?.getNearestEnd()?.distance,
      nearestTrain: this.getTrain()?.getNearestTrain()?.distance,
    };
  }

  persistData(): WagonData {
      return {
          id: this.id,
          appearanceId: this.getAppearanceId(),
          ray: this.getCenterRay().persist(),
          rayA: this.getAxlePosition(WhichEnd.A).getRay().persist(),
          rayB: this.getAxlePosition(WhichEnd.B).getRay().persist(),
          isTrainSelected: this.isSelected(),
          isFirst: this === Util.first(this.getTrain()?.getWagons()),
          isLast: this === Util.last(this.getTrain()?.getWagons()),
      }
  }

  select(): void {
      super.select();
      this.update();
  }

  deselect(): void {
    super.deselect();
    this.update();
  }

  load(obj: any, store: Store): void {
    this.presetId(obj.id);
    this.init(obj.config);

    this.setSeatCount(obj.seatCount, obj.seatColumns);
    this.boardable.load(obj.seats, store);

    if (obj.trip) {
      this.assignTrip(store.get(obj.trip) as Trip);
    }

    // this.renderer.init(this);
  }
}

doApply();
