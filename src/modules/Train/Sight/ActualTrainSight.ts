import { Station } from "../../../structs/Scheduling/Station";
import { PositionedTrackMarker } from "../../PositionedTrackMarker";
import { SignalSignal } from "../../Signaling/SignalSignal";
import { DirectedTrack } from "../../Track/DirectedTrack";
import { PositionOnTrack } from "../PositionOnTrack";
import { Train } from "../Train";
import { Sight } from "./Sight";
import { TrainSight } from "./TrainSight";

export class ActualTrainSight implements TrainSight {
    getSight(position: PositionOnTrack, dist: number, nextStation?: Station, train?: Train): Sight {
        const { distance, markers } = this.findMarkers(position, dist);
        return {
            distance,
            markers: markers
                .filter(m => ['Train', 'Signal', 'Platform', 'End'].includes(m.marker.type))
                .filter(m => m.marker.type !== 'Train' || m.marker.train !== train)
                .map(m => ({ type: m.marker.type, speed: this.determineSpeed(m, nextStation) }))
        };
    }

    private findMarkers(position: PositionOnTrack, distance: number): { distance: number, markers: PositionedTrackMarker[] } {
        const positionedTrackMarkers: PositionedTrackMarker[] = [];
        let distanceLeft = distance;
        let dt: DirectedTrack = position.getDirectedTrack();
        let startPosition = position.getPosition();
        let endPosition = Math.min(dt.getLength(), startPosition + distanceLeft);
        distanceLeft = distanceLeft - (endPosition - startPosition);

        do {
            positionedTrackMarkers.push(...dt.getMarkersPartially({ startPosition, endPosition, track: dt }));

            dt = dt.next();
            if (dt) {
                startPosition = 0;
                endPosition = Math.min(dt.getLength(), distanceLeft);
                distanceLeft = distanceLeft - (endPosition - startPosition);
            }
        }
        while (dt && distanceLeft > 0);

        if (distanceLeft > 0) {
            positionedTrackMarkers.push({ position: null, marker: { type: 'End' } });
        }

        return { distance: distance - distanceLeft, markers: positionedTrackMarkers };
    }

    private determineSpeed(m: PositionedTrackMarker, nextStation: Station): number {
        switch (m.marker.type) {
            case 'Signal':
                return (m.marker.signal.getSignal() === SignalSignal.Red) ? 0 : Number.POSITIVE_INFINITY;

            case 'Platform':
                return m.marker.platform.getStation() === nextStation ? 0 : Number.POSITIVE_INFINITY;

            default:
                return 0;
        }
    }
}
