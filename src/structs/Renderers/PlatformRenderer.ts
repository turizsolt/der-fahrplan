import { Platform } from '../../modules/Station/Platform';
import { BaseRenderer } from './BaseRenderer';

export interface PlatformRenderer extends BaseRenderer {
    init(platform: Platform): void;
}
