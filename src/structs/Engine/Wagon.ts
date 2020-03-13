import { BaseBrick } from '../Base/BaseBrick';

export interface Wagon extends BaseBrick {
  init(): Wagon;
  update(): void;
}
