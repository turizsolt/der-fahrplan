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
import { BlockEnd } from './BlockEnd';
import { BlockJoint } from './BlockJoint';
import { PositionOnTrack } from '../Train/PositionOnTrack';

export interface ActualBlock extends Emitable {}
const doApply = () => applyMixins(ActualBlock, [Emitable]);
export class ActualBlock extends ActualBaseBrick implements Block {
  private segment: BlockSegment = null;
  private coords: Coordinate[] = [];

  init(segmentData: BlockSegmentData): Block {
    this.initStore(TYPES.Block);

    this.segment = new ActualBlockSegment(this, segmentData);

    const start: PositionOnTrack = this.segment
      .getEnd(WhichEnd.A)
      .getJointEnd()
      .joint.getPosition();
    const end: PositionOnTrack = this.segment
      .getEnd(WhichEnd.B)
      .getJointEnd()
      .joint.getPosition();

    // coords
    const lsc =
      this.sameCoords(start, end, x => x) ||
      this.sameCoords(start, end, x => x.reverse()) ||
      this.findCoords(start, end, x => x) ||
      this.findCoords(start, end, x => x.reverse());
    if (lsc && lsc.length && lsc.length > 1) {
      const x = lsc.map(x => x.getRays().map(y => y.coord));
      this.coords = [].concat(...x);
    } else {
      console.info('no lsc found');
      // CoordinateToBabylonVector3(Ray.fromData(data.rayA).setY(1.5).coord),
      // CoordinateToBabylonVector3(Ray.fromData(data.rayB).setY(1.5).coord)
      this.coords = [start.getRay().coord, end.getRay().coord];
    }

    this.emit('init', this.persist());
    return this;
  }

  remove(): void {
    this.emit('remove', this.id);
  }

  private findCoords(start: PositionOnTrack, end: PositionOnTrack, fx) {
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

  private sameCoords(start: PositionOnTrack, end: PositionOnTrack, fx) {
    let iter = fx(start.getDirectedTrack());
    if (iter !== end.getDirectedTrack()) return null;

    const lsc: LineSegmentChain[] = [];
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
      segmentData: this.segment.persist(),
      isFree: this.isFree(),

      // for visuals
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
      /*
      endA:
        this.segment
          .getEnd(WhichEnd.A)
          .getJointEnd()
          .joint.getId() +
        '-' +
        this.segment.getEnd(WhichEnd.A).getJointEnd().end,
      endB:
        this.segment
          .getEnd(WhichEnd.B)
          .getJointEnd()
          .joint.getId() +
        '-' +
        this.segment.getEnd(WhichEnd.B).getJointEnd().end
      */
    };
  }

  getSegment(): BlockSegment {
    return this.segment;
  }

  getEnd(whichEnd: WhichEnd): BlockEnd {
    return this.segment.getEnd(whichEnd);
  }

  load(obj: any, store: Store): void {
    this.presetId(obj.id);
    this.init(toBlockSegmentData(obj.segmentData, store));
    this.getSegment().connect();
  }
}
doApply();

export function toBlockSegmentData(data: any, store: Store): BlockSegmentData {
  return {
    startJointEnd: {
      end: data.startJointEnd.end,
      joint: store.get(data.startJointEnd.joint) as BlockJoint
    },
    endJointEnd: {
      end: data.endJointEnd.end,
      joint: store.get(data.endJointEnd.joint) as BlockJoint
    }
  };
}
