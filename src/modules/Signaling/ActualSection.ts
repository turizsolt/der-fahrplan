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

export interface ActualSection extends Emitable {}
const doApply = () => applyMixins(ActualSection, [Emitable]);
export class ActualSection extends ActualBaseBrick implements Section {
  private direction: TrackDirection = undefined;
  private trainCount: number = 0;
  private permanentDirection: boolean = false;
  private ends: Record<WhichEnd, SectionEnd> = { A: null, B: null };

  init(
    startBlockJointEnd: BlockJointEnd,
    endBlockJointEnd: BlockJointEnd
  ): Section {
    this.initStore(TYPES.Section);

    this.ends = {
      A: new ActualSectionEnd(this, WhichEnd.A, startBlockJointEnd),
      B: new ActualSectionEnd(this, WhichEnd.A, endBlockJointEnd)
    };

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
    this.trainCount++;
    this.emit('update', this.persist());
  }

  checkout(train: Train): void {
    this.trainCount--;
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
      permanentDirection: this.permanentDirection
    };
  }

  load(obj: any, store: Store): void {
    this.presetId(obj.id);
    this.init(null, null);
    this.direction = obj.direction;
    this.trainCount = obj.trainCount;
    this.permanentDirection = obj.permanentDirection;
    this.emit('update', this.persist());
  }
}
doApply();
