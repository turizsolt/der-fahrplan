import { BaseBrick } from '../../structs/Interfaces/BaseBrick';

export interface Signal extends BaseBrick {
  init(): Signal;
}
