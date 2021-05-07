import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { BlockJointEnd } from './BlockJointEnd';
import { TrackDirection } from '../Track/TrackDirection';
import { WhichEnd } from '../../structs/Interfaces/WhichEnd';
import { Train } from '../Train/Train';

export interface Section extends BaseBrick {
  init(
    startBlockJointEnd: BlockJointEnd,
    endBlockJointEnd: BlockJointEnd
  ): Section;
  isFree(direction: TrackDirection): boolean;
  getDirection(): TrackDirection;
  checkin(whichEnd: WhichEnd, train: Train): void;
  checkout(train: Train): void;
  setDirectionPermanent(permanentDirection: boolean): void;
  isDirectionPermanent(): boolean;
}
