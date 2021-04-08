import { Ray } from '../Geometry/Ray';
import { WhichEnd } from '../Interfaces/WhichEnd';
import { Platform } from './Platform';
import { BaseBrick } from './BaseBrick';
import { TrackWorm } from '../../modules/Train/TrackWorm';
import { Passenger } from './Passenger';
import { Boardable } from '../../mixins/Boardable';
import { WagonConfig } from '../Actuals/Wagon/WagonConfig';
import { WagonControlType } from '../Actuals/Wagon/WagonControl/WagonControlType';
import { PassengerArrangement } from '../../mixins/BoardableWagon';
import { WagonConnectable } from '../Actuals/Wagon/WagonConnectable';
import { WagonMovingState } from '../Actuals/Wagon/WagonMovingState';
import { Trip } from '../Scheduling/Trip';
import { PositionOnTrack } from '../../modules/Train/PositionOnTrack';
import { Emitable } from '../../mixins/Emitable';
import { Train } from '../../modules/Train/Train';

export interface Wagon extends Boardable, BaseBrick, Emitable {
  init(config?: WagonConfig, train?: Train): Wagon;
  update(): void;
  getRay(): Ray;
  onStocked(): void;
  getSelectedSide(): WhichEnd | null;
  swapSelectedSide(): void;
  accelerate(): void;
  break(): void;

  setAxlePosition(whichEnd: WhichEnd, pot: PositionOnTrack): void;
  getAxlePosition(whichEnd: WhichEnd): PositionOnTrack;
  axleReverse(): void;

  getMaxSpeed(): number;
  getAccelerateBy(): number;
  getControlType(): WagonControlType;
  getPassengerArrangement(): PassengerArrangement;
  getPassengerCount(): number;
  getAppearanceId(): string;
  getConnectable(A: WhichEnd): WagonConnectable;

  getWorm(): TrackWorm;
  getCenterRay(): Ray;

  stop(): void;

  getLength(): number;
  swapEnds(): void;

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

  disconnect(whichEnd: WhichEnd): void;
  halt(): void;

  platformsBeside(): Platform[];
}
