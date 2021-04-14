import { BaseRenderer } from './BaseRenderer';

export interface PathBlockRenderer extends BaseRenderer {
  init(data: any): void;
  update(data: any): void;
}
