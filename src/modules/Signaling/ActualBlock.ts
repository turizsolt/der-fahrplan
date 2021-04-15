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
import { LineSegmentChain } from '../../structs/Geometry/LineSegmentChain';
import { Coordinate } from '../../structs/Geometry/Coordinate';

export interface ActualBlock extends Emitable {}
const doApply = () => applyMixins(ActualBlock, [Emitable]);
export class ActualBlock extends ActualBaseBrick implements Block {
  private segment: BlockSegment = null;
  private coords: Coordinate[] = [];

  init(segmentData: BlockSegmentData): Block {
    this.initStore(TYPES.Block);

    this.segment = new ActualBlockSegment(this, segmentData);

    const start = this.segment
      .getEnd(WhichEnd.A)
      .getJointEnd()
      .joint.getPosition();
    const end = this.segment
      .getEnd(WhichEnd.B)
      .getJointEnd()
      .joint.getPosition();

    // coords
    const lsc =
      this.sameCoords(start, end) ||
      this.findCoords(start, end, x => x) ||
      this.findCoords(start, end, x => x.reverse());
    const x = lsc.map(x => x.getRays().map(y => y.coord));
    this.coords = [].concat(...x);

    this.emit('init', this.persist());
    return this;
  }

  private findCoords(start, end, fx) {
    const lsc: LineSegmentChain[] = [];
    let iter = fx(start.getDirectedTrack());
    const line = iter
      .getCurve()
      .getLineSegmentChain()
      .getChainFromPoint(start.getRay().coord);
    lsc.push(line);

    while ((iter = iter.next())) {
      if (
        iter === end.getDirectedTrack() ||
        iter === end.getDirectedTrack().reverse()
      ) {
        const line = iter
          .getCurve()
          .getLineSegmentChain()
          .getChainToPoint(end.getRay().coord);
        lsc.push(line);
        return lsc;
      }
      const line = iter.getCurve().getLineSegmentChain();
      lsc.push(line);
    }

    return null;
  }

  private sameCoords(start, end) {
    if (start.getDirectedTrack() !== end.getDirectedTrack()) return null;

    const lsc: LineSegmentChain[] = [];
    let iter = start.getDirectedTrack();
    const { s, e } =
      start.getPosition() < end.getPosition()
        ? { s: start, e: end }
        : { s: end, e: start };
    const line = iter
      .getCurve()
      .getLineSegmentChain()
      .getChainFromPoint(s.getRay().coord)
      .getChainToPoint(e.getRay().coord);
    lsc.push(line);

    return lsc;
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
        .persist(),
      coords: this.coords
    };
  }

  load(obj: Object, store: Store): void {
    throw new Error('Method not implemented.');
  }
}
doApply();
