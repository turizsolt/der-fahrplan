import { TYPES } from "../../../di/TYPES";
import { Coordinate } from "../../Geometry/Coordinate";
import { Store } from "../../Interfaces/Store";
import { Track } from "../../Interfaces/Track";
import { TrackBase } from "../../Interfaces/TrackBase";
import { TrackJoint } from "../../Interfaces/TrackJoint";
import { ActualLogStore } from "./ActualLogStore";

export enum CommandMode {
    Master,
    Network,
    Replay
}

export class Commander {
    private mode: CommandMode;

    constructor(private store: Store, private logStore: ActualLogStore) {
        this.mode = CommandMode.Master;
    }

    setMode(mode: CommandMode): void {
        this.mode = mode;
    }

    createTrackJoint(x: number, z: number, angle: number): TrackJoint {
        const j2: TrackJoint = this.store.create<TrackJoint>(TYPES.TrackJoint);
        j2.init(x, z, angle);
        this.store.getLogStore().addAction({
            type: 'creation',
            object: j2.getId(),
            function: 'init',
            params: [x, z, angle],
            objectType: 'TrackJoint'
        });
        return j2;
    }

    createTrack(coordinates: Coordinate[]): Track {
        const t = this.store.create<Track>(TYPES.Track).init(coordinates);
        this.store.getLogStore().addAction({
            type: 'creation',
            object: t.getId(),
            function: 'init',
            params: coordinates,
            objectType: 'Track'
        });
        return t;
    }
}
