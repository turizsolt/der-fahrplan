import { Platform } from '../Interfaces/Platform';
import { BaseRenderer } from './BaseRenderer';

export interface PlatformRenderer extends BaseRenderer {
  init(platform: Platform): void;
}
