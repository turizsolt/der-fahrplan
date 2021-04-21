import { ActualBaseBrick } from '../../structs/Actuals/ActualBaseBrick';
import { BaseRenderer } from '../../structs/Renderers/BaseRenderer';
import { Store } from '../../structs/Interfaces/Store';
import { Emitable } from '../../mixins/Emitable';
import { applyMixins } from '../../mixins/ApplyMixins';
import { TYPES } from '../../di/TYPES';
import { PathBlock } from './PathBlock';
import { BlockJointEnd } from './BlockJointEnd';

export interface ActualPathBlock extends Emitable {}
const doApply = () => applyMixins(ActualPathBlock, [Emitable]);
export class ActualPathBlock extends ActualBaseBrick implements PathBlock {
  private jointEnds: BlockJointEnd[] = [];

  init(jointEnds: BlockJointEnd[]): PathBlock {
    this.initStore(TYPES.PathBlock);

    this.jointEnds = jointEnds;
    console.log('pathblock created', jointEnds);

    this.emit('init', this.persist());
    return this;
  }

  getRenderer(): BaseRenderer {
    throw new Error('Method not implemented.');
  }

  persist(): Object {
    return {
      id: this.getId(),
      type: 'PathBlock'
    };
  }

  load(obj: Object, store: Store): void {
    throw new Error('Method not implemented.');
  }
}
doApply();
