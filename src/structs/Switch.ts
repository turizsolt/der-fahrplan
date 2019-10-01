import * as BABYLON from "babylonjs";
import {SwitchTrackEnd} from "./SwitchTrackEnd";
import {TrackBase} from "./TrackBase";
import {TrackEnd} from "./TrackEnd";
import {TrackSegment} from "./TrackSegment";

export class Switch extends TrackBase {
    readonly D: TrackEnd;
    readonly E: SwitchTrackEnd;
    readonly F: SwitchTrackEnd;

    readonly IE: BABYLON.Vector3;
    readonly IF: BABYLON.Vector3;

    readonly segmentE: TrackSegment;
    readonly segmentF: TrackSegment;

    get A() { return this.D; }
    get B() { return this.state ? this.F : this.E; }
    get I() { return this.state ? this.IF : this.IE; }
    get segment() { return this.state ? this.segmentF: this.segmentE; }

    private mesh: BABYLON.LinesMesh; // todo: kell-e?
    private state: number;

    constructor(a: BABYLON.Vector3, b: BABYLON.Vector3, c: BABYLON.Vector3,
                ib?: BABYLON.Vector3, ic?: BABYLON.Vector3) {
        super();
        this.D = new TrackEnd(a, this);
        this.E = new SwitchTrackEnd(b, this);
        this.F = new SwitchTrackEnd(c, this);
        if (ib) { this.IE = ib; }
        if (ic) { this.IF = ic; }

        this.segmentE = new TrackSegment(a, b, ib, true);
        this.segmentF = new TrackSegment(a, c, ic, true);

        this.state = 0;
        this.E.active = true;
        this.F.active = false;
    }

    render(scene: BABYLON.Scene) {
        const track1 = BABYLON.MeshBuilder.CreateDashedLines(
            'track',
            {points: this.segmentE.curvePoints, gapSize: 5, dashSize: 1},
            scene);
        track1.color = new BABYLON.Color3(0, 0, 0);

        const track2 = BABYLON.MeshBuilder.CreateDashedLines(
            'track',
            {points: this.segmentF.curvePoints, gapSize: 5, dashSize: 1},
            scene);
        track2.color = new BABYLON.Color3(0, 0, 0);

        const track = BABYLON.Mesh.CreateLines("lines", this.segment.curvePoints, scene, true);
        track.color = new BABYLON.Color3(0, 0, 0);
        this.mesh = track;
        return track;
    }

    switch() {
        if(this.checkedList.length > 0) return;

        this.state = 1 - this.state;
        if(this.mesh) this.mesh = BABYLON.Mesh.CreateLines(null, this.segment.curvePoints, null, null, this.mesh);

        if(this.state) {
            this.F.reconnect();
            this.E.disconnect();
            this.F.active = true;
            this.E.active = false;
        } else {
            this.E.reconnect();
            this.F.disconnect();
            this.E.active = true;
            this.F.active = false;
        }
    }
}
