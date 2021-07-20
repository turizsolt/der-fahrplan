import { BaseRenderer } from './BaseRenderer';

export interface SensorRenderer extends BaseRenderer {
  init(data: any): void;
  update(data: any): void;
}
