import { ActualBaseStorable } from '../Actuals/ActualStorable';
import { Store } from '../Interfaces/Store';
import { TYPES } from '../../di/TYPES';
import { Train } from './Train';

export class ActualTrain extends ActualBaseStorable implements Train {
  init(): Train {
    super.initStore(TYPES.Train);
    return this;
  }

  persist(): Object {
    return {
      id: this.id,
      type: 'Train'
    };
  }

  load(obj: any, store: Store): void {
    this.presetId(obj.id);
    this.init();
  }
}
