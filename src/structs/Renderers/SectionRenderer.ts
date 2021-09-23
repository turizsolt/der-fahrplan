import { BaseRenderer } from './BaseRenderer';

export interface SectionRenderer extends BaseRenderer {
  init(data: any): void;
  update(data: any): void;
}
