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
import { TrackSwitch } from '../Track/TrackSwitch';
import { Block } from './Block';
import { WhichEnd } from '../../structs/Interfaces/WhichEnd';
import { AllowedPath } from './AllowedPath';

export interface ActualPathBlock extends Emitable {}
const doApply = () => applyMixins(ActualPathBlock, [Emitable]);
export class ActualPathBlock extends ActualBaseBrick implements PathBlock {
  private pathBlockEnds: PathBlockEnd[] = [];
  private allowedPathes: AllowedPath[] = [];

  init(jointEnds: BlockJointEnd[]): PathBlock {
    this.initStore(TYPES.PathBlock);

    this.pathBlockEnds = jointEnds.map(je => new ActualPathBlockEnd(je, this));
    this.pathBlockEnds.map(pbe => pbe.pathConnect());
    console.log('pathblock created', jointEnds);

    this.emit('init', this.persist());
    return this;
  }

  allow(
    startPathBlockEnd: PathBlockEnd,
    endPathBlockEnd: PathBlockEnd,
    count: number = 1
  ): void {
    const startDt: DirectedTrack = startPathBlockEnd
      .getJointEnd()
      .joint.getPosition()
      .getDirectedTrack();
    const endDt: DirectedTrack = endPathBlockEnd
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
      this.handle(next);
      while ((next = info[next.getHash()])) {
        this.handle(next);
      }

      const block = this.store.create<Block>(TYPES.Block).init({
        startJointEnd: startPathBlockEnd.getJointEnd(),
        endJointEnd: endPathBlockEnd.getJointEnd()
      });
      startPathBlockEnd.setBlockEnd(block.getEnd(WhichEnd.A));
      endPathBlockEnd.setBlockEnd(block.getEnd(WhichEnd.B));
      startPathBlockEnd.pathConnect();
      endPathBlockEnd.pathConnect();

      this.allowedPathes.push({
        startPathBlockEnd,
        endPathBlockEnd,
        block,
        count
      });
    }
  }

  checkout(endPathBlockEnd: PathBlockEnd): void {
    const allowedPath = this.allowedPathes.find(
      x =>
        x.endPathBlockEnd === endPathBlockEnd ||
        x.startPathBlockEnd === endPathBlockEnd
    );
    if (allowedPath) {
      allowedPath.count--;
      if (allowedPath.count < 1) {
        allowedPath.block.getSegment().disconnect();
        allowedPath.block.remove();
        allowedPath.startPathBlockEnd.setBlockEnd(null);
        allowedPath.endPathBlockEnd.setBlockEnd(null);
        allowedPath.startPathBlockEnd.pathConnect();
        allowedPath.endPathBlockEnd.pathConnect();
        this.allowedPathes = this.allowedPathes.filter(x => x !== allowedPath);
      }
    }
  }

  private handle(dt: DirectedTrack): void {
    const track = dt.getTrack();
    if (track.getType() === TYPES.TrackSwitch) {
      if (track.getActiveSegment() !== dt.getSegment()) {
        (track as TrackSwitch).switch();
      }
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
