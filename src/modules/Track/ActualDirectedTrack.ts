import { injectable } from 'inversify';
import { DirectedTrack } from './DirectedTrack';

@injectable()
export class ActualDirectedTrack implements DirectedTrack {
    private nextTrack: DirectedTrack = null;
    private reverseTrack: DirectedTrack = null;

    init(): DirectedTrack {
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
}
