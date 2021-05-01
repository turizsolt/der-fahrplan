import { ActualBaseBrick } from '../../structs/Actuals/ActualBaseBrick';
import { Store } from '../../structs/Interfaces/Store';
import { Emitable } from '../../mixins/Emitable';
import { applyMixins } from '../../mixins/ApplyMixins';
import { TYPES } from '../../di/TYPES';
import { Sensor } from './Sensor';
import { BaseRenderer } from '../../structs/Renderers/BaseRenderer';

export interface ActualSensor extends Emitable {}
const doApply = () => applyMixins(ActualSensor, [Emitable]);
export class ActualSensor extends ActualBaseBrick implements Sensor {
  init(): Sensor {
    this.initStore(TYPES.Signal);

    this.emit('init', this.persist());
    return this;
  }

  getRenderer(): BaseRenderer {
    throw new Error('Method not implemented.');
  }

  persist(): Object {
    return {
      id: this.id,
      type: 'Sensor'
    };
  }

  load(obj: Object, store: Store): void {
    throw new Error('Method not implemented.');
  }
}
doApply();
