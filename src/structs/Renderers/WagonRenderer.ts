import { BaseRenderer } from './BaseRenderer';
import { WagonData } from '../../modules/Train/WagonData';

export interface WagonRenderer extends BaseRenderer {
  init(wagon: WagonData): void;
}
