import { ActualBaseBrick } from '../../structs/Actuals/ActualBaseBrick';
import { Store } from '../../structs/Interfaces/Store';
import { Emitable } from '../../mixins/Emitable';
import { applyMixins } from '../../mixins/ApplyMixins';
import { TYPES } from '../../di/TYPES';
import { Sensor } from './Sensor';
import { BaseRenderer } from '../../structs/Renderers/BaseRenderer';
import { PositionOnTrack } from '../Train/PositionOnTrack';
import { PathBlock } from './PathBlock';
import { PathBlockEnd } from './PathBlockEnd';
import { Train } from '../Train/Train';

export interface ActualSensor extends Emitable {}
const doApply = () => applyMixins(ActualSensor, [Emitable]);
export class ActualSensor extends ActualBaseBrick implements Sensor {
  private position: PositionOnTrack;
  private pathBlock: PathBlock;
  private pathBlockEnd: PathBlockEnd;

  init(
    position: PositionOnTrack,
    pathBlock: PathBlock,
    pathBlockEnd: PathBlockEnd
  ): Sensor {
    this.initStore(TYPES.Signal);

    this.position = position;
    this.pathBlock = pathBlock;
    this.pathBlockEnd = pathBlockEnd;

    this.position
      .getDirectedTrack()
      .addMarker(this.position.getPosition(), { type: 'Sensor', sensor: this });

    this.emit('init', this.persist());
    return this;
  }

  checkin(train: Train): void {
    this.pathBlock.requestPath(this.pathBlockEnd, train);
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
