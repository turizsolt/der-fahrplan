import { almost } from "../../structs/Geometry/Almost";
import { crossProduct } from "../../structs/Geometry/LineSegment";
import { TrackSegmentData } from "./TrackSegmentData";

export function detectTrackType(segmentData: TrackSegmentData): string {
    if (segmentData.coordinates.length === 2) {
        const leg = segmentData.coordinates[0].distance2d(segmentData.coordinates[1]);
        const n = Math.round(leg / 10);
        return 'E' + n;
    } else {
        const firstLeg = segmentData.coordinates[0].distance2d(segmentData.coordinates[1]);
        const secondLeg = segmentData.coordinates[1].distance2d(segmentData.coordinates[2]);
        if (almost(firstLeg, secondLeg)) {
            const diagonal = segmentData.coordinates[0].distance2d(segmentData.coordinates[2]);
            if (almost(firstLeg * Math.sqrt(3), diagonal)) {
                const n = Math.round(firstLeg / 10);
                if (crossProduct(segmentData.coordinates[0], segmentData.coordinates[1], segmentData.coordinates[2]) === 1) {
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