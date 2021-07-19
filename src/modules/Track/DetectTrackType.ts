import { almost } from "../../structs/Geometry/Almost";
import { Coordinate } from "../../structs/Geometry/Coordinate";
import { crossProduct } from "../../structs/Geometry/LineSegment";
import { TrackSegmentData } from "./TrackSegmentData";

export function detectTrackType(segmentData: TrackSegmentData): string {
    const coordinates: Coordinate[] = segmentData.coordinates.filter(x => x);
    if (coordinates.length === 2) {
        const leg = coordinates[0].distance2d(coordinates[1]);
        const n = Math.round(leg / 10);
        return 'E' + n;
    } else {
        const firstLeg = coordinates[0].distance2d(coordinates[1]);
        const secondLeg = coordinates[1].distance2d(coordinates[2]);
        if (almost(firstLeg, secondLeg)) {
            const diagonal = coordinates[0].distance2d(coordinates[2]);
            if (almost(firstLeg * Math.sqrt(3), diagonal)) {
                const n = Math.round(firstLeg / 10);
                if (crossProduct(coordinates[0], coordinates[1], coordinates[2]) === 1) {
                    return 'L' + n;
                } else {
                    return 'R' + n;
                }
            } else {
                return 'Q';
            }
        } else {
            return 'P';
        }
    }
}