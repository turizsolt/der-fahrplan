import { ActualBaseBrick } from '../../structs/Actuals/ActualBaseBrick';
import { Store } from '../../structs/Interfaces/Store';
import { Emitable } from '../../mixins/Emitable';
import { applyMixins } from '../../mixins/ApplyMixins';
import { TYPES } from '../../di/TYPES';
import { Sensor } from './Sensor';
import { BaseRenderer } from '../../structs/Renderers/BaseRenderer';
import { PositionOnTrack } from '../Train/PositionOnTrack';

export interface ActualSensor extends Emitable {}
const doApply = () => applyMixins(ActualSensor, [Emitable]);
export class ActualSensor extends ActualBaseBrick implements Sensor {
  private position: PositionOnTrack;

  init(position: PositionOnTrack): Sensor {
    this.initStore(TYPES.Signal);

    this.position = position;

    this.emit('init', this.persist());
    return this;
  }

  getRenderer(): BaseRenderer {
    throw new Error('Method not implemented.');
  }

  persist(): Object {
    return {
      id: this.id,
      type: 'Sensor',
      ray: this.position.getRay().persist()
    };
  }

  load(obj: Object, store: Store): void {
    throw new Error('Method not implemented.');
  }
}
doApply();
