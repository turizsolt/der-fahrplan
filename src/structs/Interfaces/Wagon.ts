import { WagonEnd } from '../Actuals/Wagon/WagonEnd';
import { Ray } from '../Geometry/Ray';
import { Track } from './Track';
import { PositionOnTrack } from '../Actuals/Track/PositionOnTrack';
import { WhichEnd } from '../Interfaces/WhichEnd';
import { Platform } from './Platform';
import { Updatable } from '../../mixins/Updatable';
import { BaseBrick } from './BaseBrick';
import { Train } from '../Scheduling/Train';
import { TrackWorm } from '../Actuals/Track/TrackWorm';
import { Passenger } from './Passenger';
import { Boardable } from '../../mixins/Boardable';
import { WagonConfig } from '../Actuals/Wagon/WagonConfig';
import { WagonControlType } from '../Actuals/Wagon/WagonControl/WagonControlType';
import { PassengerArrangement } from '../../mixins/BoardableWagon';
import { WagonConnectable } from '../Actuals/Wagon/WagonConnectable';
import { WagonMovingState } from '../Actuals/Wagon/WagonMovingState';
import { Trip } from '../Scheduling/Trip';

export interface Wagon extends Boardable, BaseBrick, Updatable {
  init(config?: WagonConfig): Wagon;
  update(): void;
  getA(): WagonEnd;
  getB(): WagonEnd;
  getEnd(whichEnd: WhichEnd): WagonEnd;
  getRay(): Ray;
  remove(): boolean;
  isRemoved(): boolean;
  isAFree(): boolean;
  isBFree(): boolean;
  isOneFree(): boolean;
  onStocked(): void;
  getSelectedSide(): WhichEnd | null;
  swapSelectedSide(): void;
  accelerate(): void;
  break(): void;
  getLastWagon(whichEnd: WhichEnd): Wagon;

  getMaxSpeed(): number;
  getAccelerateBy(): number;
  getControlType(): WagonControlType;
  getPassengerArrangement(): PassengerArrangement;
  getAppearanceId(): string;
  getConnectable(A: WhichEnd): WagonConnectable;

  getWorm(): TrackWorm;
  getCenterRay(): Ray;

  putOnTrack(track: Track, position?: number, direction?: number): void;
  moveTowardsWagon(whichEnd: WhichEnd, distance: number): void;
  moveTowardsWagonB(distance: number): void;
  moveTowardsWagonA(distance: number): void;
  stop(): void;

  getLength(): number;
  getNearestWagon(end: WhichEnd): NearestWagon;
  swapEnds(): void;
  pullToPos(pot: PositionOnTrack, dir: number): void;

  assignTrip(trip: Trip): void;
  setTrip(trip: Trip): void;
  cancelTrip(): void;
  getTrip(): Trip;

  stoppedAt(platform: Platform): void;
  hasFreeSeat(): boolean;
  setSeatCount(count: number, columns?: number);
  moveBoardedPassengers(): void;

  getTrain(): Train;
  setTrain(train: Train): void;

  getBoardedPassengers(): Passenger[];
  detach(): void;
  tick(): void;
  getSpeed(): number;

  shuntForward(): void;
  shuntBackward(): void;

  setControlingWagon(wagon: Wagon): void;
  getControlingWagon(): Wagon;
  clearControlingWagon(): void;
  canThisWagonControl(): boolean;

  disconnect(whichEnd: WhichEnd): void;
  getMovingState(): WagonMovingState;
  halt(): void;

  platformsBeside(): Platform[];
}

export interface NearestWagon {
  distance: number;
  wagon: Wagon;
  end: WagonEnd;
}
