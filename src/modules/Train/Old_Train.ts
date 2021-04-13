import { BaseStorable } from '../../structs/Interfaces/BaseStorable';
import { Wagon } from '../../structs/Interfaces/Wagon';
import { Route } from '../../structs/Scheduling/Route';
import { Platform } from '../../structs/Interfaces/Platform';
import { Station } from '../../structs/Scheduling/Station';
import {
  WagonWithSide,
  WagonIdWithSide
} from '../../structs/Interfaces/WagonWithSide';
import { WhichEnd } from '../../structs/Interfaces/WhichEnd';
import { Trip } from '../../structs/Scheduling/Trip';

export interface Old_Train extends BaseStorable {
  init(first: Wagon): Old_Train;
  remove(): void;
  isRemoved(): boolean;
  getWagons(): Wagon[];
  setWagonsWithSides(wagonsWithSides: WagonWithSide[]);
  stoppedAt(station: Station, platform: Platform): void;
  getFreeWagon(): Wagon;
  mergeWith(thisEnd: any, other: Old_Train, otherEnd: any): void;
  separateThese(wagons: Wagon[]): void;
  moveBoardedPassengers(): void;
  hasLocomotive(): boolean;
  getControlingWagon(): Wagon;
  getLastControlingWagon(): Wagon;
  setControlingWagon(wagon: Wagon): void;
  clearControlingWagon(): void;

  assignTrip(trip: Trip, wagons?: Wagon[]): void;
  getTrips(): Trip[];
  removeTrip(trip: Trip): void;
  setMovingness(movingness: boolean): void;

  getWagonsWithSides(): WagonWithSide[];
  getWagonIdsWithSides(): WagonIdWithSide[];
  whichEndIsOn(end: any): WhichEnd;
}
