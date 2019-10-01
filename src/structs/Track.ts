import * as BABYLON from "babylonjs";
import {TrackBase} from "./TrackBase";
import {TrackEnd} from "./TrackEnd";
import {TrackCreatorListElement} from "./TrackList";
import {TrackSegment} from "./TrackSegment";

export class Track extends TrackBase {
    readonly A: TrackEnd;
    readonly B: TrackEnd;
    readonly I: BABYLON.Vector3;
    readonly segment: TrackSegment;

    private mesh: BABYLON.Mesh; // todo: kell-e?

    constructor(a: TrackCreatorListElement, b: TrackCreatorListElement, i?: TrackCreatorListElement) {
        super();
        this.A = new TrackEnd(new BABYLON.Vector3(a.x, 0, a.z), this);
        this.B = new TrackEnd(new BABYLON.Vector3(b.x, 0, b.z), this);
        if (i) {
            this.I = new BABYLON.Vector3(i.x, 0, i.z);
        }
        this.segment = new TrackSegment(this.A.point, this.B.point, this.I);
    }

    render(scene: BABYLON.Scene) {
        const track = BABYLON.MeshBuilder.CreateLines(
            'track',
            {points: this.segment.curvePoints},
            scene);
        track.color = new BABYLON.Color3(0, 0, 0);
        this.mesh = track;
        return track;
    }
}
