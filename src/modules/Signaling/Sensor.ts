import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { PositionOnTrack } from '../Train/PositionOnTrack';

export interface Sensor extends BaseBrick {
  init(position: PositionOnTrack): Sensor;
}
