import { BaseStorable } from '../Interfaces/BaseStorable';
import { Wagon } from '../Interfaces/Wagon';
import { Route } from './Route';
import { Platform } from '../Interfaces/Platform';
import { Station } from './Station';

export interface Train extends BaseStorable {
  init(first: Wagon): Train;
  remove(): void;
  isRemoved(): boolean;
  getWagons(): Wagon[];
  setWagons(wagons: Wagon[]);
  getTrip(): Route;
  stoppedAt(station: Station, platform: Platform): void;
  getFreeWagon(): Wagon;
  getSchedulingWagon(): Wagon;
  setSchedulingWagon(wagon: Wagon): void;
  cancelTrip(): void;
  mergeWith(other: Train): void;
  separateThese(wagons: Wagon[]): void;
  moveBoardedPassengers(): void;
}
