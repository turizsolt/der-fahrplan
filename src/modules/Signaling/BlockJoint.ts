import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { PositionOnTrack } from '../Train/PositionOnTrack';

export interface BlockJoint extends BaseBrick {
  init(position: PositionOnTrack): BlockJoint;
}
