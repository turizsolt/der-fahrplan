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
import { Train } from '../Train/Train';
import { WhichEnd } from '../../structs/Interfaces/WhichEnd';

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

  private checkedTrains: Train[] = [];

  checkin(train: Train): void {
    this.checkedTrains.push(train);
    this.emit('update', this.persist());
  }

  checkout(train: Train): void {
    this.checkedTrains = this.checkedTrains.filter(x => x !== train);
    this.emit('update', this.persist());
  }

  isFree(): boolean {
    return this.checkedTrains.length === 0;
  }

  getRenderer(): BaseRenderer {
    throw new Error('Method not implemented.');
  }

  persist(): Object {
    return {
      id: this.id,
      type: 'Block',
      isFree: this.isFree(),
      rayA: this.segment
        .getEnd(WhichEnd.A)
        .getJointEnd()
        .joint.getPosition()
        .getRay()
        .persist(),
      rayB: this.segment
        .getEnd(WhichEnd.B)
        .getJointEnd()
        .joint.getPosition()
        .getRay()
        .persist()
    };
  }

  load(obj: Object, store: Store): void {
    throw new Error('Method not implemented.');
  }
}
doApply();
