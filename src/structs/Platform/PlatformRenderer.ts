import { Platform } from './Platform';

export interface PlatformRenderer {
  init(platform: Platform): void;
}
