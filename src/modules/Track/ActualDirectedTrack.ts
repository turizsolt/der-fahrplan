import { injectable } from 'inversify';
import { ActualTrackSegment } from './ActualTrackSegment';
import { DirectedTrack } from './DirectedTrack';

@injectable()
export class ActualDirectedTrack implements DirectedTrack {
    private nextTrack: DirectedTrack = null;
    private reverseTrack: DirectedTrack = null;
    private segment: ActualTrackSegment = null;

    init(segment: ActualTrackSegment): DirectedTrack {
        this.segment = segment;
        return this;
    }

    next(): DirectedTrack {
        return this.nextTrack;
    }

    setNext(nextTrack: DirectedTrack): void {
        this.nextTrack = nextTrack;
    }

    reverse(): DirectedTrack {
        return this.reverseTrack;
    }

    setReverse(reverseTrack: DirectedTrack): void {
        this.reverseTrack = reverseTrack;
    }

    getSegment(): ActualTrackSegment {
        return this.segment;
    }
}
