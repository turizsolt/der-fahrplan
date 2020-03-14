import { BaseRenderer } from '../Base/BaseRenderer';
import { Wagon } from './Wagon';

export interface WagonRenderer extends BaseRenderer {
  init(wagon: Wagon): void;
}
