import { TYPES } from "../../../di/TYPES";
import { Station } from "../../../modules/Station/Station";
import { PositionedTrackMarker } from "../../PositionedTrackMarker";
import { SignalSignal } from "../../Signaling/SignalSignal";
import { AbstractPlatform } from "../../Station/AbstractPlatform";
import { DirectedTrack } from "../../Track/DirectedTrack";
import { TrackSwitch } from "../../Track/TrackSwitch";
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
                .map(m => ({ type: m.marker.type, speed: this.determineSpeed(m, nextStation), distance: m.position, object: m.marker.platform || m.marker.train }))
        };
    }

    private findMarkers(position: PositionOnTrack, distance: number): { distance: number, markers: PositionedTrackMarker[] } {
        const positionedTrackMarkers: PositionedTrackMarker[] = [];
        let distanceLeft = distance;
        let dt: DirectedTrack = position.getDirectedTrack();
        let startPosition = position.getPosition();
        let endPosition = Math.min(dt.getLength(), startPosition + distanceLeft);
        distanceLeft = distanceLeft - (endPosition - startPosition);
        let globalStartPosition = -startPosition;

        positionedTrackMarkers.push(
            ...dt.getMarkersPartially({ startPosition, endPosition, track: dt })
                .map(m => ({ ...m, position: m.position + globalStartPosition }))
        );

        dt = dt.next();
        while (dt && distanceLeft > 0) {
            startPosition = 0;
            endPosition = Math.min(dt.getLength(), distanceLeft);
            distanceLeft = distanceLeft - (endPosition - startPosition);
            globalStartPosition = globalStartPosition + dt.getLength();

            positionedTrackMarkers.push(
                ...dt.getMarkersPartially({ startPosition, endPosition, track: dt })
                    .map(m => ({ ...m, position: m.position + globalStartPosition }))
            );
            dt = dt.next();
        }

        if (distanceLeft > 0) {
            positionedTrackMarkers.push({ position: distance - distanceLeft, marker: { type: 'End' } });
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

    findNextPlatform(position: PositionOnTrack, trainId: string): AbstractPlatform {
        const positionedTrackMarkers: PositionedTrackMarker[] = [];
        let dt: DirectedTrack = position.getDirectedTrack();
        let startPosition = position.getPosition();
        let endPosition = dt.getLength();
        let globalStartPosition = -startPosition;

        if (dt.getTrack().getType() === TYPES.TrackSwitch && ((dt.getTrack()) as TrackSwitch).getLockedTrain() !== trainId) {
            return null;
        }

        for (let m of dt.getMarkersPartially({ startPosition, endPosition, track: dt })) {
            if (m.marker.type === 'Platform') {
                return m.marker.platform;
            }
        }

        dt = dt.next();
        while (dt) {
            startPosition = 0;
            endPosition = dt.getLength();
            globalStartPosition = globalStartPosition + dt.getLength();

            if (dt.getTrack().getType() === TYPES.TrackSwitch && ((dt.getTrack()) as TrackSwitch).getLockedTrain() !== trainId) {
                return null;
            }

            for (let m of dt.getMarkersPartially({ startPosition, endPosition, track: dt })) {
                if (m.marker.type === 'Platform') {
                    return m.marker.platform;
                }
            }
            dt = dt.next();
        }

        return null;
    }
}
