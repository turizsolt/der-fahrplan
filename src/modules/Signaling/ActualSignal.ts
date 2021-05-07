import { Signal } from './Signal';
import { ActualBaseBrick } from '../../structs/Actuals/ActualBaseBrick';
import { BaseRenderer } from '../../structs/Renderers/BaseRenderer';
import { Store } from '../../structs/Interfaces/Store';
import { Emitable } from '../../mixins/Emitable';
import { applyMixins } from '../../mixins/ApplyMixins';
import { SignalSignal } from './SignalSignal';
import { PositionOnTrack } from '../Train/PositionOnTrack';
import { TYPES } from '../../di/TYPES';
import { BlockEnd } from './BlockEnd';
import { BlockJoint } from './BlockJoint';

export interface ActualSignal extends Emitable {}
const doApply = () => applyMixins(ActualSignal, [Emitable]);
export class ActualSignal extends ActualBaseBrick implements Signal {
  private signal: SignalSignal = SignalSignal.Red;
  private hidden: boolean = false;
  private position: PositionOnTrack = null;
  private blockEnd: BlockEnd = null;
  private blockSubscribe: (data: any) => void;

  init(position: PositionOnTrack, blockEnd?: BlockEnd, startSignal?: SignalSignal): Signal {
    this.signal = startSignal || SignalSignal.Red;
    this.initStore(TYPES.Signal);
    this.position = position;
    this.position.getDirectedTrack().addMarker(this.position.getPosition(), {
      type: 'Signal',
      signal: this
    });

    this.blockSubscribe = (data: any) => {
      this.setSignal(data.signal);
      if(data.hidden) {
        this.setHidden();
      }
    };
    this.blockSubscribe.bind(this);

    this.blockEnd = blockEnd;
    this.blockEnd?.on('update', this.blockSubscribe);
    const blockEndHidden = this.blockEnd?.persist().hidden;
    if(blockEndHidden) { 
      this.hidden = true;
    }

    this.emit('init', this.persist());
    return this;
  }

  setHidden(): void {
    this.hidden = true;
    this.emit('update', this.persist());
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
      hidden: this.hidden,
      ray: this.position.getRay().persist(),
      positionOnTrack: this.position.persist(),
      blockEnd: this.blockEnd?.persist()
    };
  }

  load(obj: any, store: Store): void {
    this.presetId(obj.id);
    let blockEnd = undefined;
    if(obj.blockEnd) {
        const joint = store.get(obj.blockEnd.joint) as BlockJoint;
        blockEnd = joint.getEnd(obj.blockEnd.end);
    }
    this.init(PositionOnTrack.fromData(obj.positionOnTrack, store), blockEnd, obj.signal);
    if(obj.hidden) { this.setHidden(); }
  }

  remove() {
    super.remove();
    this.blockEnd?.off('update', this.blockSubscribe);
  }
}
doApply();
