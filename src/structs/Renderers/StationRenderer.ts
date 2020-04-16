import { BaseRenderer } from './BaseRenderer';
import { Station } from '../Scheduling/Station';

export interface StationRenderer extends BaseRenderer {
  init(station: Station): void;
}
