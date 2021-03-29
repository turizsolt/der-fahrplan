export interface DirectedTrack {
    init(): DirectedTrack;

    next(): DirectedTrack;
    setNext(nextTrack: DirectedTrack): void;

    reverse(): DirectedTrack;
    setReverse(reverseTrack: DirectedTrack): void;
}
