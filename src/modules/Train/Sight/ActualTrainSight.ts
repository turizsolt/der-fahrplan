import { PositionOnTrack } from "../PositionOnTrack";
import { Sight } from "./Sight";
import { TrainSight } from "./TrainSight";

export class ActualTrainSight implements TrainSight {
    getSight(position: PositionOnTrack, distance: number): Sight {
        return {
            position,
            distance: 0,
            markers: []
        }
    }
}
