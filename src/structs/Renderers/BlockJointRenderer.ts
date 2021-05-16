import { BaseRenderer } from './BaseRenderer';

export interface BlockJointRenderer extends BaseRenderer {
  init(data: any): void;
  update(data: any): void;
}
