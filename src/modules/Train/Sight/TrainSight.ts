import { Station } from "../../../modules/Station/Station";
import { PositionOnTrack } from "../PositionOnTrack";
import { Train } from "../Train";
import { Sight } from "./Sight";

export interface TrainSight {
    getSight(position: PositionOnTrack, distance: number, nextStation?: Station, train?: Train): Sight;
}
