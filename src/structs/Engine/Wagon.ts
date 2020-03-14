import { BaseBrick } from '../Base/BaseBrick';
import { WagonEnd } from './ActualWagon';

export interface Wagon extends BaseBrick {
  init(): Wagon;
  update(): void;
  getA(): WagonEnd;
  getB(): WagonEnd;
}
