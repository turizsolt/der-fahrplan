import { BaseRenderer } from './BaseRenderer';

export interface SignalRenderer extends BaseRenderer {
  init(signal: any): void;
}
