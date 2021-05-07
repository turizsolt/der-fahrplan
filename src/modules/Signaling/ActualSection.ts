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

export interface ActualSection extends Emitable {}
const doApply = () => applyMixins(ActualSection, [Emitable]);
export class ActualSection extends ActualBaseBrick implements Section {
  private direction: TrackDirection = undefined;
  private trainCount: number = 0;
  private permanentDirection: boolean = false;

  init(
    startBlockJointEnd: BlockJointEnd,
    endBlockJointEnd: BlockJointEnd
  ): Section {
    this.initStore(TYPES.Section);
    this.emit('init', this.persist());
    return this;
  }

  isFree(direction: TrackDirection): boolean {
    return this.direction === direction || !this.direction;
  }

  getDirection(): TrackDirection {
    return this.direction;
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
  }

  checkout(train: Train): void {
    this.trainCount--;
    if (this.trainCount < 1 && !this.permanentDirection) {
      this.direction = undefined;
    }
  }

  setDirectionPermanent(permanentDirection: boolean): void {
    this.permanentDirection = permanentDirection;
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
      type: 'Section'
    };
  }

  load(obj: Object, store: Store): void {
    throw new Error('Method not implemented.');
  }
}
doApply();
