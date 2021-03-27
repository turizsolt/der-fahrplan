import { TYPES } from "../../../../di/TYPES";
import { Coordinate } from "../../../Geometry/Coordinate";
import { Store } from "../../../Interfaces/Store";
import { Track } from "../../../../modules/Track/Track";
import { TrackBase } from "../../../../modules/Track/TrackBase";
import { TrackJoint } from "../../../../modules/Track/TrackJoint/TrackJoint";
import { TrackSwitch } from "../../../../modules/Track/TrackSwitch";
import { Wagon } from "../../../Interfaces/Wagon";
import { WhichEnd } from "../../../Interfaces/WhichEnd";
import { WagonConfig } from "../../Wagon/WagonConfig";
import { CommandLog } from "./CommandLog";

export class CommandProcessor {
    constructor(private store: Store, private logStore: CommandLog) { }

    createTrackJoint(id: string, x: number, z: number, angle: number): TrackJoint {
        const j2 = this.store.create<TrackJoint>(TYPES.TrackJoint);
        j2.presetId(id);
        j2.init(x, z, angle);
        return j2;
    }

    uncreateTrackJoint(id: string, x: number, z: number, angle: number): void {
        const j2 = this.store.get(id) as TrackJoint;
        j2.remove();
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

    unjoinTrackJoints(trackId: string, coordinates: Coordinate[], jointId1: string, whichEnd1: WhichEnd, jointId2, whichEnd2: WhichEnd): void {
        const track = this.store.get(trackId) as Track;
        const one = this.store.get(jointId1) as TrackJoint;
        const other = this.store.get(jointId2) as TrackJoint;

        one.removeEnd(track.getA());
        other.removeEnd(track.getB());
        track.remove();
    }

    joinTrackJoints3(trackId: string, oldCoordinates: Coordinate[], coordinates: Coordinate[],
        jointId1: string, whichEnd1: WhichEnd, jointId2: string, whichEnd2: WhichEnd, jointId3: string, whichEnd3: WhichEnd
    ): TrackBase {
        const trackSwitch = this.store.create<TrackSwitch>(TYPES.TrackSwitch);
        trackSwitch.presetId(trackId);
        trackSwitch.init(oldCoordinates, coordinates);

        const one = this.store.get(jointId1) as TrackJoint;
        const other = this.store.get(jointId2) as TrackJoint;
        const third = this.store.get(jointId3) as TrackJoint;

        one.setOneEnd(whichEnd1, trackSwitch.getA());
        other.setOneEnd(whichEnd2, trackSwitch.getE());
        third.setOneEnd(whichEnd3, trackSwitch.getF());

        return trackSwitch;
    }

    unjoinTrackJoints3(trackId: string, oldCoordinates: Coordinate[], coordinates: Coordinate[],
        jointId1: string, whichEnd1: WhichEnd, jointId2: string, whichEnd2: WhichEnd, jointId3: string, whichEnd3: WhichEnd
    ): void {
        const trackSwitch = this.store.get(trackId) as TrackSwitch;
        const one = this.store.get(jointId1) as TrackJoint;
        const other = this.store.get(jointId2) as TrackJoint;
        const third = this.store.get(jointId3) as TrackJoint;

        one.removeEnd(trackSwitch.getA());
        other.removeEnd(trackSwitch.getE());
        third.removeEnd(trackSwitch.getF());
        trackSwitch.remove();
    }

    createWagon(wagonId: string, trainId: string, wagonConfig: WagonConfig, trackId: string, position: number, direction: number): Wagon {
        const wagon = this.store.create<Wagon>(TYPES.Wagon);
        const track = this.store.get(trackId) as Track;
        wagon.presetId(wagonId);
        wagon.init(wagonConfig, trainId);
        wagon.putOnTrack(track, position, direction);
        return wagon;
    }

    uncreateWagon(wagonId: string, trainId: string, wagonConfig: WagonConfig, trackId: string, position: number, direction: number): void {
        const wagon = this.store.get(wagonId) as Wagon;
        wagon.remove();
    }
}
