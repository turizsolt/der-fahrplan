import { ActualBaseBrick } from '../../structs/Actuals/ActualBaseBrick';
import { BaseRenderer } from '../../structs/Renderers/BaseRenderer';
import { Store } from '../../structs/Interfaces/Store';
import { Emitable } from '../../mixins/Emitable';
import { applyMixins } from '../../mixins/ApplyMixins';
import { TYPES } from '../../di/TYPES';
import { BlockJoint } from './BlockJoint';

export interface ActualBlockJoint extends Emitable {}
const doApply = () => applyMixins(ActualBlockJoint, [Emitable]);
export class ActualBlockJoint extends ActualBaseBrick implements BlockJoint {
  init(): BlockJoint {
    this.initStore(TYPES.BlockJoint);
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
