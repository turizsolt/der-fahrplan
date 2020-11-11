import { BaseStorable } from '../Interfaces/BaseStorable';
import { Wagon } from '../Interfaces/Wagon';
import { Route } from './Route';
import { Platform } from '../Interfaces/Platform';
import { Station } from './Station';
import { WagonWithSide, WagonIdWithSide } from '../Interfaces/WagonWithSide';
import { WagonEnd } from '../Actuals/Wagon/WagonEnd';
import { WhichEnd } from '../Interfaces/WhichEnd';
import { Trip } from './Trip';

export interface Train extends BaseStorable {
  init(first: Wagon): Train;
  remove(): void;
  isRemoved(): boolean;
  getWagons(): Wagon[];
  setWagonsWithSides(wagonsWithSides: WagonWithSide[]);
  stoppedAt(station: Station, platform: Platform): void;
  getFreeWagon(): Wagon;
  mergeWith(thisEnd: WagonEnd, other: Train, otherEnd: WagonEnd): void;
  separateThese(wagons: Wagon[]): void;
  moveBoardedPassengers(): void;
  hasLocomotive(): boolean;
  getControlingWagon(): Wagon;
  setControlingWagon(wagon: Wagon): void;
  clearControlingWagon(): void;

  assignTrip(trip: Trip, wagons?: Wagon[]): void;

  getWagonsWithSides(): WagonWithSide[];
  getWagonIdsWithSides(): WagonIdWithSide[];
  whichEndIsOn(end: WagonEnd): WhichEnd;
}
