import { Vector } from 'src/Geometry/Vector';
import { TrackModel } from './TrackModel';
import { TileType } from '../TileModel';
import { Coordinate } from 'src/Geometry/Coordinate';
import { Rectangle } from 'src/Geometry/Rectangle';

export class SwitchModelRight extends TrackModel {
    public static getSleeperVector(track: SwitchModelRight, sleeper: number): Vector {
        if(track.isSwitched()) {
            // turning
            return new Vector(track.center.y-(track.box.getHeight()/2/track.sleeperCount)*sleeper, track.box.left+(track.box.getWidth()/track.sleeperCount)*sleeper, 0);
        } else {
            // straight
            return new Vector(track.center.y, track.box.left+(track.box.getWidth()/track.sleeperCount)*sleeper, 0);
        }
    }

    public static doSwitch(track: SwitchModelRight):SwitchModelRight {
        return new SwitchModelRight(track.type, track.id, track.center, track.box, track.sleeperCount, track.attachedA, track.attachedS, track.attachedB, !track.switched);
    }

    public constructor(type: TileType, id:string, center: Coordinate, box: Rectangle, sleeperCount: number, attachedA: string|null, attachedB: string|null, public attachedS: string|null, public switched:boolean=false) {
        super(type, id, center, box, sleeperCount, attachedA, attachedB);
    }

    public isSwitched():boolean {
        return this.switched;
    }
}
