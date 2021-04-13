import { BaseRenderer } from './BaseRenderer';

export interface SignalRenderer extends BaseRenderer {
  init(data: any): void;
  update(data: any): void;
}
