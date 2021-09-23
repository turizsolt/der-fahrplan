import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { Boardable } from '../../mixins/Boardable';
import { AbstractPlatform } from './AbstractPlatform';
import { Platform } from './Platform';

export interface PlatformGroup extends BaseBrick, Boardable, AbstractPlatform {
    getNo(): string;

    init(platforms: Platform[]): PlatformGroup;
}
