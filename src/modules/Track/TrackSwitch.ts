import { TrackBase } from './TrackBase';
import { TrackCurve } from './TrackCurve';
import { TrackSegmentData } from './TrackSegmentData';
import { DirectedTrack } from './DirectedTrack';

export interface TrackSwitch extends TrackBase {
    init(
        segmentData1: TrackSegmentData,
        segmentData2: TrackSegmentData
    ): TrackSwitch;
    switch();
    getState(): number;
    lock(train: string): void;
    unlock(): void;
    getLockedTrain(): string;
    isLocked(): boolean;

    getSegmentLeft(): TrackCurve;
    getSegmentRight(): TrackCurve;
    getAdjacentDirectedTracks(): DirectedTrack[];

    getTrackTypes(): string[];
}
