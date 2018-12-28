import { Vector } from 'src/Geometry/Vector';
import { TrackModel } from './TrackModel';

export class TrackSModel extends TrackModel {
    public static getSleeperVector(track: TrackModel, sleeper: number): Vector {
        return new Vector(track.center.y-(track.box.getHeight()/2/track.sleeperCount)*sleeper, track.box.left+(track.box.getWidth()/track.sleeperCount)*sleeper, 0);
    }
}
