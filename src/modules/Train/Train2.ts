import { BaseStorable } from '../../structs/Interfaces/BaseStorable';
import { Wagon } from '../../structs/Interfaces/Wagon';
import { PositionOnTrack } from './PositionOnTrack';

export interface Train2 extends BaseStorable {
  init(pot: PositionOnTrack, wagons: Wagon[]): Train2;
  getPosition(): PositionOnTrack;
  getWagons(): Wagon[];
  addWagons(wagons: Wagon[]): void;
  merge(otherTrain: Train2): void;
  separate(wagon: Wagon, newTrainId?: string): Train2;
  reverse(): void;
}
