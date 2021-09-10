import { PositionOnTrack } from "../PositionOnTrack";
import { SightMarker } from "./SightMarker";

export interface Sight {
    position: PositionOnTrack;
    distance: number;
    markers: SightMarker[];
}
