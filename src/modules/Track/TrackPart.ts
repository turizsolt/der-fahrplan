import { DirectedTrack } from "./DirectedTrack";

export interface TrackPart {
    startPosition: number;
    endPosition: number;
    track: DirectedTrack;
}
