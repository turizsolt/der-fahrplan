import { ActualBaseBrick } from '../../structs/Actuals/ActualBaseBrick';
import { BaseRenderer } from '../../structs/Renderers/BaseRenderer';
import { Store } from '../../structs/Interfaces/Store';
import { Emitable } from '../../mixins/Emitable';
import { applyMixins } from '../../mixins/ApplyMixins';
import { TYPES } from '../../di/TYPES';
import { Segment } from './Segment';

export interface ActualSegment extends Emitable {}
const doApply = () => applyMixins(ActualSegment, [Emitable]);
export class ActualSegment extends ActualBaseBrick implements Segment {
  init(): Segment {
    this.initStore(TYPES.Segment);
    this.emit('init', this.persist());
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
