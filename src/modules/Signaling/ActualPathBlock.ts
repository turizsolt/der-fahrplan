import { ActualBaseBrick } from '../../structs/Actuals/ActualBaseBrick';
import { BaseRenderer } from '../../structs/Renderers/BaseRenderer';
import { Store } from '../../structs/Interfaces/Store';
import { Emitable } from '../../mixins/Emitable';
import { applyMixins } from '../../mixins/ApplyMixins';
import { TYPES } from '../../di/TYPES';
import { PathBlock } from './PathBlock';
import { BlockJointEnd } from './BlockJointEnd';
import { PathBlockEnd } from './PathBlockEnd';
import { ActualPathBlockEnd } from './ActualPathBlockEnd';
import { DirectedTrack } from '../Track/DirectedTrack';

export interface ActualPathBlock extends Emitable {}
const doApply = () => applyMixins(ActualPathBlock, [Emitable]);
export class ActualPathBlock extends ActualBaseBrick implements PathBlock {
  private pathBlockEnds: PathBlockEnd[] = [];

  init(jointEnds: BlockJointEnd[]): PathBlock {
    this.initStore(TYPES.PathBlock);

    this.pathBlockEnds = jointEnds.map(je => new ActualPathBlockEnd(je, this));
    this.pathBlockEnds.map(pbe => pbe.pathConnect());
    console.log('pathblock created', jointEnds);

    this.emit('init', this.persist());
    return this;
  }

  allow(startPBE: PathBlockEnd, endPBE: PathBlockEnd, count: number = 1): void {
    const startDt: DirectedTrack = startPBE
      .getJointEnd()
      .joint.getPosition()
      .getDirectedTrack();
    const endDt: DirectedTrack = endPBE
      .getJointEnd()
      .joint.getPosition()
      .getDirectedTrack();

    const queue: DirectedTrack[] = [];
    const info: Record<string, any> = {};
    queue.push(startDt);
    queue.push(startDt.reverse());
    info[startDt.getHash()] = null;
    info[startDt.reverse().getHash()] = null;

    let backFromHere: DirectedTrack = null;

    while (queue.length > 0) {
      const dt = queue.shift();

      if (dt === endDt || dt === endDt.reverse()) {
        backFromHere = dt;
        break;
      }

      for (let next of dt.permaNexts()) {
        queue.push(next);
        info[next.getHash()] = dt;
      }
    }

    if (backFromHere) {
      let next: DirectedTrack = backFromHere;
      while ((next = info[next.getHash()])) {}
    }
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
