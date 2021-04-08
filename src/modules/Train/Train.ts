import { BaseStorable } from '../../structs/Interfaces/BaseStorable';
import { Wagon } from '../../structs/Interfaces/Wagon';
import { PositionOnTrack } from './PositionOnTrack';
import { TrainSpeed } from './TrainSpeed';

export interface Train extends BaseStorable {
  init(pot: PositionOnTrack, wagons: Wagon[]): Train;
  getPosition(): PositionOnTrack;
  getWagons(): Wagon[];
  addWagons(wagons: Wagon[]): void;
  merge(otherTrain: Train): void;
  separate(wagon: Wagon, newTrainId?: string): Train;
  reverse(): void;
  tick(): void;
  setPosition(position: PositionOnTrack): void;
  getSpeed(): TrainSpeed;
}
