import { BaseBrick } from '../../structs/Interfaces/BaseBrick';

export interface Sensor extends BaseBrick {
  init(): Sensor;
}
