import { BaseRenderer } from './BaseRenderer';
import { Wagon } from '../Interfaces/Wagon';

export interface WagonRenderer extends BaseRenderer {
  init(wagon: Wagon): void;
}
