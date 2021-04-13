import { Signal } from './Signal';
import { ActualBaseBrick } from '../../structs/Actuals/ActualBaseBrick';
import { BaseRenderer } from '../../structs/Renderers/BaseRenderer';
import { Store } from '../../structs/Interfaces/Store';
import { Emitable } from '../../mixins/Emitable';
import { applyMixins } from '../../mixins/ApplyMixins';
import { SignalSignal } from './SignalSignal';

export interface ActualSignal extends Emitable {}
const doApply = () => applyMixins(ActualSignal, [Emitable]);
export class ActualSignal extends ActualBaseBrick implements Signal {
  private signal: SignalSignal = SignalSignal.Red;

  init(): Signal {
    this.emit('init', this.persist());
    return this;
  }

  getSignal(): SignalSignal {
    return this.signal;
  }

  setSignal(signal: SignalSignal): void {
    this.signal = signal;
    this.emit('update', this.persist());
  }

  getRenderer(): BaseRenderer {
    throw new Error('Method not implemented.');
  }
  persist(): Object {
    return { signal: this.signal };
  }
  load(obj: Object, store: Store): void {
    throw new Error('Method not implemented.');
  }
}
doApply();
