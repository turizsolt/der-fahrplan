import { BaseStorable } from '../Interfaces/BaseStorable';
import { Wagon } from '../Interfaces/Wagon';

export interface Train extends BaseStorable {
  init(first: Wagon): Train;
  remove(): void;
  isRemoved(): boolean;
  getWagons(): Wagon[];
  setWagons(wagons: Wagon[]);
  mergeWith(other: Train): void;
  separateThese(wagons: Wagon[]): void;
}
