import { Signal } from './Signal';
import { ActualBaseBrick } from '../../structs/Actuals/ActualBaseBrick';
import { BaseRenderer } from '../../structs/Renderers/BaseRenderer';
import { Store } from '../../structs/Interfaces/Store';
import { Emitable } from '../../mixins/Emitable';
import { applyMixins } from '../../mixins/ApplyMixins';
import { SignalSignal } from './SignalSignal';
import { PositionOnTrack } from '../Train/PositionOnTrack';
import { TYPES } from '../../di/TYPES';

export interface ActualSignal extends Emitable {}
const doApply = () => applyMixins(ActualSignal, [Emitable]);
export class ActualSignal extends ActualBaseBrick implements Signal {
  private signal: SignalSignal = SignalSignal.Red;
  private position: PositionOnTrack = null;

  init(position: PositionOnTrack): Signal {
    this.initStore(TYPES.Signal);
    this.position = position;
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
    return {
      id: this.id,
      type: 'Signal',
      signal: this.signal,
      ray: this.position.getRay().persist()
    };
  }
  load(obj: Object, store: Store): void {
    throw new Error('Method not implemented.');
  }
}
doApply();
