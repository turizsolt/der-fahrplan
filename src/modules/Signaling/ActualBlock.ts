import { ActualBaseBrick } from '../../structs/Actuals/ActualBaseBrick';
import { BaseRenderer } from '../../structs/Renderers/BaseRenderer';
import { Store } from '../../structs/Interfaces/Store';
import { Emitable } from '../../mixins/Emitable';
import { applyMixins } from '../../mixins/ApplyMixins';
import { TYPES } from '../../di/TYPES';
import { Block } from './Block';
import { BlockSegmentData } from './BlockSegmentData';
import { BlockSegment } from './BlockSegment';
import { ActualBlockSegment } from './ActualBlockSegment';

export interface ActualBlock extends Emitable {}
const doApply = () => applyMixins(ActualBlock, [Emitable]);
export class ActualBlock extends ActualBaseBrick implements Block {
  private segment: BlockSegment = null;

  init(segmentData: BlockSegmentData): Block {
    this.initStore(TYPES.Block);

    this.segment = new ActualBlockSegment(this, segmentData);

    this.emit('init', this.persist());
    return this;
  }

  getRenderer(): BaseRenderer {
    throw new Error('Method not implemented.');
  }

  persist(): Object {
    return {
      id: this.id,
      type: 'Block'
    };
  }

  load(obj: Object, store: Store): void {
    throw new Error('Method not implemented.');
  }
}
doApply();
