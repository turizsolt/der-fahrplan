import { PositionedTrackMarker } from "../../PositionedTrackMarker";
import { DirectedTrack } from "../../Track/DirectedTrack";
import { PositionOnTrack } from "../PositionOnTrack";
import { Sight } from "./Sight";
import { TrainSight } from "./TrainSight";

export class ActualTrainSight implements TrainSight {
    getSight(position: PositionOnTrack, distance: number): Sight {
        return {
            distance,
            markers: this.findMarkers(position, distance)
                .map(m => ({ type: m.marker.type, speed: 0 }))
        }
    }

    private findMarkers(position: PositionOnTrack, distance: number): PositionedTrackMarker[] {
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

        return positionedTrackMarkers;
    }
}
