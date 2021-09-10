import { Station } from "../../../structs/Scheduling/Station";
import { PositionOnTrack } from "../PositionOnTrack";
import { Sight } from "./Sight";

export interface TrainSight {
    getSight(position: PositionOnTrack, distance: number, nextStation?: Station): Sight;
}
