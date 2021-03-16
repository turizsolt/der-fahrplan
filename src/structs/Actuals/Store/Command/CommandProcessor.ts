import { TYPES } from "../../../../di/TYPES";
import { Coordinate } from "../../../Geometry/Coordinate";
import { Store } from "../../../Interfaces/Store";
import { Track } from "../../../Interfaces/Track";
import { TrackBase } from "../../../Interfaces/TrackBase";
import { TrackJoint } from "../../../Interfaces/TrackJoint";
import { WhichEnd } from "../../../Interfaces/WhichEnd";
import { CommandLog } from "./CommandLog";

export class CommandProcessor {
    constructor(private store: Store, private logStore: CommandLog) { }

    createTrackJoint(id: string, x: number, z: number, angle: number): TrackJoint {
        const j2 = this.store.create<TrackJoint>(TYPES.TrackJoint);
        j2.presetId(id);
        j2.init(x, z, angle);
        return j2;
    }

    joinTrackJoints(trackId: string, coordinates: Coordinate[], jointId1: string, whichEnd1: WhichEnd, jointId2, whichEnd2: WhichEnd): TrackBase {
        const track = this.store.create<Track>(TYPES.Track);
        track.presetId(trackId);
        track.init(coordinates);

        const one = this.store.get(jointId1) as TrackJoint;
        const other = this.store.get(jointId2) as TrackJoint;

        one.setOneEnd(whichEnd1, track.getA());
        other.setOneEnd(whichEnd2, track.getB());

        return track;
    }
}
