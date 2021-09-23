import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { BlockJointEnd } from './BlockJointEnd';
import { TrackDirection } from '../Track/TrackDirection';
import { WhichEnd } from '../../structs/Interfaces/WhichEnd';
import { Train } from '../Train/Train';
import { Emitable } from '../../mixins/Emitable';

export interface Section extends BaseBrick, Emitable {
  init(
    startBlockJointEnd: BlockJointEnd,
    endBlockJointEnd: BlockJointEnd
  ): Section;
  isFree(direction: TrackDirection): boolean;
  getDirection(): TrackDirection;
  setDirection(direction: TrackDirection): void;
  checkin(whichEnd: WhichEnd, train: Train): void;
  checkout(train: Train): void;
  setDirectionPermanent(permanentDirection: boolean): void;
  isDirectionPermanent(): boolean;
  connect(): void;
  disconnect(): void;
}
