import { TYPES } from "../../../../di/TYPES";
import { Coordinate } from "../../../Geometry/Coordinate";
import { Store } from "../../../Interfaces/Store";
import { Track } from "../../../Interfaces/Track";
import { TrackJoint } from "../../../Interfaces/TrackJoint";
import { CommandLog } from "./CommandLog";

export class CommandProcessor {
    constructor(private store: Store, private logStore: CommandLog) { }

    createTrackJoint(id: string, x: number, z: number, angle: number): TrackJoint {
        const j2: TrackJoint = this.store.create<TrackJoint>(TYPES.TrackJoint);
        j2.presetId(id);
        j2.init(x, z, angle);
        /*this.store.getCommandLog().addAction({
            type: 'creation',
            object: j2.getId(),
            function: 'init',
            params: [x, z, angle],
            objectType: 'TrackJoint'
        });*/
        return j2;
    }

    /*
    createTrack(coordinates: Coordinate[]): Track {
        const t = this.store.create<Track>(TYPES.Track);
        if (false) { // this.mode === CommandMode.Replay) {
            const id = this.logStore.getPresetId('Track');
            t.presetId(id);
            t.init(coordinates);
        } else {
            t.init(coordinates);
            this.store.getCommandLog().addAction({
                type: 'id',
                object: t.getId(),
                function: 'init',
                params: [],
                objectType: 'Track'
            });
        }
        return t;
    }
    */
}
