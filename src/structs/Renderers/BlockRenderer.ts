import { BaseRenderer } from './BaseRenderer';

export interface BlockRenderer extends BaseRenderer {
  init(data: any): void;
  update(data: any): void;
}
