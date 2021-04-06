import { ActualBaseStorable } from '../../structs/Actuals/ActualStorable';
import { TYPES } from '../../di/TYPES';
import { Wagon } from '../../structs/Interfaces/Wagon';
import { Train2 } from './Train2';
import { Store } from '../../structs/Interfaces/Store';
import { PositionOnTrack2 } from './PositionOnTrack2';

export class ActualTrain2 extends ActualBaseStorable implements Train2 {
  private position: PositionOnTrack2 = null;
  private wagons: Wagon[] = [];

  init(pot: PositionOnTrack2, wagons: Wagon[]): Train2 {
    // super.initStore(TYPES.Train);

    this.position = pot;
    this.wagons = wagons;
    return this;
  }

  getPosition(): PositionOnTrack2 {
    return this.position;
  }

  getWagons(): Wagon[] {
    return this.wagons;
  }

  persist(): Object {
    throw new Error('Method not implemented.');
  }

  load(obj: Object, store: Store): void {
    throw new Error('Method not implemented.');
  }
}
