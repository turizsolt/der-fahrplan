import { ActualBaseBrick } from '../../structs/Actuals/ActualBaseBrick';
import { BaseRenderer } from '../../structs/Renderers/BaseRenderer';
import { Store } from '../../structs/Interfaces/Store';
import { Emitable } from '../../mixins/Emitable';
import { applyMixins } from '../../mixins/ApplyMixins';
import { TYPES } from '../../di/TYPES';
import { Block } from './Block';

export interface ActualBlock extends Emitable {}
const doApply = () => applyMixins(ActualBlock, [Emitable]);
export class ActualBlock extends ActualBaseBrick implements Block {
  init(): Block {
    this.initStore(TYPES.Block);
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
