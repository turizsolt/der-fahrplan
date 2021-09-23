import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { PositionOnTrack } from '../Train/PositionOnTrack';
import { PathBlockEnd } from './PathBlockEnd';
import { PathBlock } from './PathBlock';
import { Train } from '../Train/Train';

export interface Sensor extends BaseBrick {
  init(
    position: PositionOnTrack,
    pathBlock: PathBlock,
    pathBlockEnd: PathBlockEnd
  ): Sensor;

  checkin(train: Train): void;

  getPosition(): PositionOnTrack;
  setPosition(position: PositionOnTrack): void;
}
