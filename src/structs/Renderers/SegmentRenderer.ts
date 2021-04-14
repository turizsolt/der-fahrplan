import { BaseRenderer } from './BaseRenderer';

export interface SegmentRenderer extends BaseRenderer {
  init(data: any): void;
  update(data: any): void;
}
