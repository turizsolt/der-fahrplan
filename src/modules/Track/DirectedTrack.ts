import { ActualTrackSegment } from "./ActualTrackSegment";

export interface DirectedTrack {
    init(segment: ActualTrackSegment): DirectedTrack;

    next(): DirectedTrack;
    setNext(nextTrack: DirectedTrack): void;

    reverse(): DirectedTrack;
    setReverse(reverseTrack: DirectedTrack): void;

    getSegment(): ActualTrackSegment;
}
