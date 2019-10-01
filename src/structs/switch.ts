import * as BABYLON from "babylonjs";
import {Track} from "./track";

export class Switch {
    readonly TA: Track;
    readonly TB: Track;
    private _state?: number;
    get state():number { return this._state;};
    private curvePoints?: BABYLON.Vector3[];
    private mesh: BABYLON.LinesMesh;

    constructor(a: Track, b: Track) {
        this.TA = a;
        this.TB = b;
        this._state = 0;
        this.curvePoints = this.TA.curvePoints;
    }

    switch() {
        this._state = 1 - this._state;
        if(this.state === 0) {
            this.curvePoints = this.TA.curvePoints;
        } else {
            this.curvePoints = this.TB.curvePoints;
        }
        if(this.mesh) this.mesh = BABYLON.Mesh.CreateLines(null, this.curvePoints, null, null, this.mesh);
    }

    render(scene: BABYLON.Scene) {
        this.TA.renderDashed(scene);
        this.TB.renderDashed(scene);

        const track = BABYLON.Mesh.CreateLines("lines", this.curvePoints, scene, true);
        track.color = new BABYLON.Color3(0, 0, 0);
        this.mesh = track;
        return track;
    }
}
