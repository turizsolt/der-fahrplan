import { BaseStorable } from '../../structs/Interfaces/BaseStorable';
import { Wagon } from '../../structs/Interfaces/Wagon';
import { PositionOnTrack } from './PositionOnTrack';
import { TrainSpeed } from './TrainSpeed';
import { NearestData } from './NearestData';
import { Trip } from '../../structs/Scheduling/Trip';
import { Station } from '../../structs/Scheduling/Station';
import { Platform } from '../../structs/Interfaces/Platform';

export interface Train extends BaseStorable {
  init(pot: PositionOnTrack, wagons: Wagon[]): Train;
  getPosition(): PositionOnTrack;
  getEndPosition(): PositionOnTrack;
  getWagons(): Wagon[];
  addWagons(wagons: Wagon[]): void;
  merge(otherTrain: Train): void;
  separate(wagon: Wagon, newTrainId?: string): Train;
  reverse(): void;
  tick(): void;
  setPosition(position: PositionOnTrack): void;
  getSpeed(): TrainSpeed;
  removeAndKeepWagons(): void;
  setAutoMode(autoMode: boolean): void;
  getAutoMode(): boolean;

  getNearestEnd(): NearestData;
  getNearestTrain(): NearestData;
  getNearestSignal(): NearestData;

  assignTrip(trip: Trip, wagons?: Wagon[]): void;
  getTrips(): Trip[];
  removeTrip(trip: Trip): void;

  stoppedAt(station: Station, platform: Platform): void;
  getFreeWagon(): Wagon;
  moveBoardedPassengers(): void;
}
