import { Ray } from '../Geometry/Ray';
import { WhichEnd } from '../Interfaces/WhichEnd';
import { Platform } from './Platform';
import { BaseBrick } from './BaseBrick';
import { Passenger } from './Passenger';
import { Boardable } from '../../mixins/Boardable';
import { WagonConfig } from '../Actuals/Wagon/WagonConfig';
import { PassengerArrangement } from '../../mixins/BoardableWagon';
import { WagonConnectable } from '../Actuals/Wagon/WagonConnectable';
import { Trip } from '../Scheduling/Trip';
import { PositionOnTrack } from '../../modules/Train/PositionOnTrack';
import { Emitable } from '../../mixins/Emitable';
import { Train } from '../../modules/Train/Train';

export interface Wagon extends Boardable, BaseBrick, Emitable {
  init(config?: WagonConfig, train?: Train): Wagon;
  update(): void;
  getRay(): Ray;

  setAxlePosition(whichEnd: WhichEnd, pot: PositionOnTrack): void;
  getAxlePosition(whichEnd: WhichEnd): PositionOnTrack;
  axleReverse(): void;

  getPassengerArrangement(): PassengerArrangement;
  getPassengerCount(): number;
  getAppearanceId(): string;
  getConnectable(A: WhichEnd): WagonConnectable;

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

  platformsBeside(): Platform[];
}
