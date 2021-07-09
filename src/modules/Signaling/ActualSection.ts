import { ActualBaseBrick } from '../../structs/Actuals/ActualBaseBrick';
import { BaseRenderer } from '../../structs/Renderers/BaseRenderer';
import { Store } from '../../structs/Interfaces/Store';
import { Emitable } from '../../mixins/Emitable';
import { applyMixins } from '../../mixins/ApplyMixins';
import { TYPES } from '../../di/TYPES';
import { Section } from './Section';
import { BlockJointEnd } from './BlockJointEnd';
import { TrackDirection } from '../Track/TrackDirection';
import { WhichEnd } from '../../structs/Interfaces/WhichEnd';
import { Train } from '../Train/Train';
import { SectionEnd } from './SectionEnd';
import { ActualSectionEnd } from './ActualSectionEnd';
import { BlockJoint } from './BlockJoint';
import { Ray } from '../../structs/Geometry/Ray';
import { PositionOnTrack } from '../Train/PositionOnTrack';

export interface ActualSection extends Emitable {}
const doApply = () => applyMixins(ActualSection, [Emitable]);
export class ActualSection extends ActualBaseBrick implements Section {
  private direction: TrackDirection = undefined;
  private trainCount: number = 0;
  private trains: Train[] = [];
  private permanentDirection: boolean = false;
  private ends: Record<WhichEnd, SectionEnd> = { A: null, B: null };
  private signageA: Ray;
  private signageB: Ray;

  init(
    startBlockJointEnd: BlockJointEnd,
    endBlockJointEnd: BlockJointEnd
  ): Section {
    this.initStore(TYPES.Section);

    this.ends = {
      A: new ActualSectionEnd(this, WhichEnd.A, startBlockJointEnd),
      B: new ActualSectionEnd(this, WhichEnd.B, endBlockJointEnd)
    };

    const posA: PositionOnTrack = this.ends.A.getJointEnd()
      .joint.getPosition()
      .clone();
    if (this.ends.A.getJointEnd().end === WhichEnd.A) {
      posA.reverse();
    }
    posA.move(5);
    this.signageA = posA.getRay();

    const posB: PositionOnTrack = this.ends.B.getJointEnd()
      .joint.getPosition()
      .clone();
    if (this.ends.B.getJointEnd().end === WhichEnd.A) {
      posB.reverse();
    }
    posB.move(5);
    this.signageB = posB.getRay();

    this.emit('init', this.persist());
    return this;
  }

  connect(): void {
    this.ends.A.connect();
    this.ends.B.connect();
  }

  disconnect(): void {
    this.ends.A.disconnect();
    this.ends.B.disconnect();
  }

  isFree(direction: TrackDirection): boolean {
    return this.direction === direction || !this.direction;
  }

  getDirection(): TrackDirection {
    return this.direction;
  }

  setDirection(direction: TrackDirection): void {
    if (this.isDirectionChangable()) {
      this.direction = direction;
    }

    this.emit('update', this.persist());
  }

  checkin(whichEnd: WhichEnd, train: Train): void {
    if (this.isDirectionChangable()) {
      if (whichEnd === WhichEnd.A) {
        this.direction = TrackDirection.AB;
      } else {
        this.direction = TrackDirection.BA;
      }
    }
    if (train) {
      this.trains.push(train);
    }
    this.trainCount++;
    this.emit('update', this.persist());
  }

  checkout(train: Train): void {
    this.trains = this.trains.filter(t => t !== train);
    this.trainCount = this.trains.length;
    if (this.trainCount < 1 && !this.permanentDirection) {
      this.direction = undefined;
    }
    this.emit('update', this.persist());
  }

  setDirectionPermanent(permanentDirection: boolean): void {
    this.permanentDirection = permanentDirection;
    if (this.trainCount < 1 && !this.permanentDirection) {
      this.direction = undefined;
    }
    this.emit('update', this.persist());
  }

  isDirectionPermanent(): boolean {
    return this.permanentDirection;
  }

  private isDirectionChangable(): boolean {
    return !this.direction && !this.permanentDirection;
  }

  getRenderer(): BaseRenderer {
    throw new Error('Method not implemented.');
  }

  persist(): Object {
    return {
      id: this.id,
      type: 'Section',
      direction: this.direction,
      trainCount: this.trainCount,
      permanentDirection: this.permanentDirection,
      isFreeA: this.isFree(TrackDirection.AB),
      isFreeB: this.isFree(TrackDirection.BA),
      startBlockJointEnd: {
        joint: this.ends.A.getJointEnd().joint.getId(),
        end: this.ends.A.getJointEnd().end
      },
      endBlockJointEnd: {
        joint: this.ends.B.getJointEnd().joint.getId(),
        end: this.ends.B.getJointEnd().end
      },
      rayA: this.signageA.persist(),
      rayB: this.signageB.persist()
    };
  }

  load(obj: any, store: Store): void {
    this.presetId(obj.id);
    this.init(
      {
        joint: store.get(obj.startBlockJointEnd.joint) as BlockJoint,
        end: obj.startBlockJointEnd.end
      },
      {
        joint: store.get(obj.endBlockJointEnd.joint) as BlockJoint,
        end: obj.endBlockJointEnd.end
      }
    );
    this.direction = obj.direction;
    this.trainCount = obj.trainCount;
    this.permanentDirection = obj.permanentDirection;
    this.connect();
    this.emit('update', this.persist());
  }
}
doApply();
