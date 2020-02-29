import { Platform } from './Platform';
import { BaseRenderer } from '../Base/BaseRenderer';

export interface PlatformRenderer extends BaseRenderer {
  init(platform: Platform): void;
}
