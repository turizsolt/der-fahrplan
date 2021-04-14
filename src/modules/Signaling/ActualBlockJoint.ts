import { ActualBaseBrick } from '../../structs/Actuals/ActualBaseBrick';
import { BaseRenderer } from '../../structs/Renderers/BaseRenderer';
import { Store } from '../../structs/Interfaces/Store';
import { Emitable } from '../../mixins/Emitable';
import { applyMixins } from '../../mixins/ApplyMixins';
import { TYPES } from '../../di/TYPES';
import { BlockJoint } from './BlockJoint';
import { PositionOnTrack } from '../Train/PositionOnTrack';

export interface ActualBlockJoint extends Emitable {}
const doApply = () => applyMixins(ActualBlockJoint, [Emitable]);
export class ActualBlockJoint extends ActualBaseBrick implements BlockJoint {
  private position: PositionOnTrack = null;
  private opposition: PositionOnTrack = null;

  init(position: PositionOnTrack): BlockJoint {
    this.initStore(TYPES.BlockJoint);

    this.position = position;
    this.opposition = position.opposition();

    this.emit('init', this.persist());
    return this;
  }

  getRenderer(): BaseRenderer {
    throw new Error('Method not implemented.');
  }

  persist(): Object {
    return {
      id: this.id,
      type: 'BlockJoint'
    };
  }

  load(obj: Object, store: Store): void {
    throw new Error('Method not implemented.');
  }
}
doApply();
