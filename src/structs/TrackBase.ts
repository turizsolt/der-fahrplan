import * as BABYLON from "babylonjs";
import {TrackEnd} from "./TrackEnd";
import {TrackSegment} from "./TrackSegment";

export abstract class TrackBase {
    readonly A: TrackEnd;
    readonly B: TrackEnd;
    readonly I: BABYLON.Vector3;
    readonly segment: TrackSegment;
    abstract render(scene: BABYLON.Scene);
}
