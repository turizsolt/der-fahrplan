import { ActualBaseStorable } from '../../structs/Actuals/ActualStorable';
import { TYPES } from '../../di/TYPES';
import { Wagon } from '../../structs/Interfaces/Wagon';
import { Train2 } from './Train2';
import { Store } from '../../structs/Interfaces/Store';
import { PositionOnTrack2 } from './PositionOnTrack2';

export class ActualTrain2 extends ActualBaseStorable implements Train2 {
  init(pot: PositionOnTrack2, wagons: Wagon[]): Train2 {
    // super.initStore(TYPES.Train);
    return this;
  }

  persist(): Object {
    throw new Error('Method not implemented.');
  }

  load(obj: Object, store: Store): void {
    throw new Error('Method not implemented.');
  }
}
