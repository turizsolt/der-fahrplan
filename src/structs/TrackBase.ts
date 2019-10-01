import * as BABYLON from "babylonjs";
import {Engine} from "./Engine";
import {TrackEnd} from "./TrackEnd";
import {TrackSegment} from "./TrackSegment";

export abstract class TrackBase {
    readonly A: TrackEnd;
    readonly B: TrackEnd;
    readonly I: BABYLON.Vector3;
    readonly segment: TrackSegment;
    abstract render(scene: BABYLON.Scene);
    protected checkedList: Engine[] = [];

    checkin(engine:Engine) {
        this.checkedList.push(engine);
    }

    checkout(engine:Engine) {
        this.checkedList = this.checkedList.filter(elem => elem !== engine);
    }
}
