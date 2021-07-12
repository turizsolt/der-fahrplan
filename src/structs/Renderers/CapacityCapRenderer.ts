import { BaseRenderer } from './BaseRenderer';

export interface CapacityCapRenderer extends BaseRenderer {
  init(data: any): void;
  update(data: any): void;
}
