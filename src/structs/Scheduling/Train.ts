import { BaseStorable } from '../Interfaces/BaseStorable';
import { Wagon } from '../Interfaces/Wagon';
import { Route } from './Route';

export interface Train extends BaseStorable {
  init(first: Wagon): Train;
  remove(): void;
  isRemoved(): boolean;
  getWagons(): Wagon[];
  setWagons(wagons: Wagon[]);
  getTrip(): Route;
  getSchedulingWagon(): Wagon;
  setSchedulingWagon(wagon: Wagon): void;
  mergeWith(other: Train): void;
  separateThese(wagons: Wagon[]): void;
}
