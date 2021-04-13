import { Signal } from './Signal';
import { ActualBaseBrick } from '../../structs/Actuals/ActualBaseBrick';
import { BaseRenderer } from '../../structs/Renderers/BaseRenderer';
import { Store } from '../../structs/Interfaces/Store';
import { Emitable } from '../../mixins/Emitable';
import { applyMixins } from '../../mixins/ApplyMixins';

export interface ActualSignal extends Emitable {}
const doApply = () => applyMixins(ActualSignal, [Emitable]);
export class ActualSignal extends ActualBaseBrick implements Signal {
  init(): Signal {
    this.emit('init', {});
    return this;
  }

  getRenderer(): BaseRenderer {
    throw new Error('Method not implemented.');
  }
  persist(): Object {
    throw new Error('Method not implemented.');
  }
  load(obj: Object, store: Store): void {
    throw new Error('Method not implemented.');
  }
}
doApply();
