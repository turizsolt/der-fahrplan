import { Signal } from './Signal';
import { ActualBaseBrick } from '../../structs/Actuals/ActualBaseBrick';
import { BaseRenderer } from '../../structs/Renderers/BaseRenderer';
import { Store } from '../../structs/Interfaces/Store';
import { Emitable } from '../../mixins/Emitable';
import { applyMixins } from '../../mixins/ApplyMixins';
import { SignalSignal } from './SignalSignal';
import { PositionOnTrack } from '../Train/PositionOnTrack';
import { TYPES } from '../../di/TYPES';
import { Block } from './Block';

export interface ActualSignal extends Emitable {}
const doApply = () => applyMixins(ActualSignal, [Emitable]);
export class ActualSignal extends ActualBaseBrick implements Signal {
  private signal: SignalSignal = SignalSignal.Green;
  private position: PositionOnTrack = null;
  private block: Block = null;
  private blockSubscribe: (data: any) => void;

  init(position: PositionOnTrack, block?: Block): Signal {
    this.initStore(TYPES.Signal);
    this.position = position;
    this.position.getDirectedTrack().addMarker(this.position.getPosition(), {
      type: 'Signal',
      signal: this
    });

    this.blockSubscribe = (data: any) => {
      this.setSignal(data.isFree ? SignalSignal.Green : SignalSignal.Red);
    };
    this.blockSubscribe.bind(this);

    this.block = block;
    this.block?.on('update', this.blockSubscribe);

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

  remove() {
    super.remove();
    this.block?.off('update', this.blockSubscribe);
  }
}
doApply();
