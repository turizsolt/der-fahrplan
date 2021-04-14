import { ActualBaseBrick } from '../../structs/Actuals/ActualBaseBrick';
import { BaseRenderer } from '../../structs/Renderers/BaseRenderer';
import { Store } from '../../structs/Interfaces/Store';
import { Emitable } from '../../mixins/Emitable';
import { applyMixins } from '../../mixins/ApplyMixins';
import { TYPES } from '../../di/TYPES';
import { PathBlock } from './PathBlock';

export interface ActualPathBlock extends Emitable {}
const doApply = () => applyMixins(ActualPathBlock, [Emitable]);
export class ActualPathBlock extends ActualBaseBrick implements PathBlock {
  init(): PathBlock {
    this.initStore(TYPES.PathBlock);
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
