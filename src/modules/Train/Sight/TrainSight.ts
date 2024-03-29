import { Station } from "../../../modules/Station/Station";
import { BlockJoint } from "../../Signaling/BlockJoint";
import { AbstractPlatform } from "../../Station/AbstractPlatform";
import { PositionOnTrack } from "../PositionOnTrack";
import { Train } from "../Train";
import { Sight } from "./Sight";

export interface TrainSight {
    getSight(position: PositionOnTrack, distance: number, nextStation?: Station, train?: Train): Sight;
    findNextPlatform(position: PositionOnTrack, trainId: string): { platform: AbstractPlatform, position: PositionOnTrack, distance: number };
    findNextBlockJoint(position: PositionOnTrack, trainId: string): { blockJoint: BlockJoint, position: PositionOnTrack, distance: number };
    distanceWithoutSwitchprivate(position: PositionOnTrack, distance: number): number;
}
