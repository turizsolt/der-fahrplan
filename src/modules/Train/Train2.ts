import { BaseStorable } from '../../structs/Interfaces/BaseStorable';
import { Wagon } from '../../structs/Interfaces/Wagon';
import { PositionOnTrack2 } from './PositionOnTrack2';

export interface Train2 extends BaseStorable {
  init(pot: PositionOnTrack2, wagons: Wagon[]): Train2;
  getPosition(): PositionOnTrack2;
  getWagons(): Wagon[];
}
