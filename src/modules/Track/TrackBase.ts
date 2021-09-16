import { Platform } from '../Station/Platform';
import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { TrackCurve } from './TrackCurve';
import { TrackDirection } from './TrackDirection';
import { DirectedTrack } from './DirectedTrack';
import { Train } from '../Train/Train';
import { TrackSegment } from './TrackSegment';

export interface TrackBase extends BaseBrick {
    checkin(train: Train);
    checkout(wagon: Train);
    isEmpty(): boolean;
    getCheckedList(): Train[];

    addPlatform(platform: Platform);
    getPlatformsBeside(): Platform[];

    getCurve(): TrackCurve;
    getLength(): number;

    getDirected(direction: TrackDirection): DirectedTrack;
    getActiveSegment(): TrackSegment;
    getHash(segment?: TrackSegment): string;

    update();
}
