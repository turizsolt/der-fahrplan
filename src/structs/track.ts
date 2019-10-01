import * as BABYLON from "babylonjs";
import {TrackCreatorListElement} from "./tracklist";

export class Track {
    readonly PA: BABYLON.Vector3;
    readonly PB: BABYLON.Vector3;
    readonly PI: BABYLON.Vector3[];
    readonly length: number;
    readonly isCurve: boolean;
    readonly curvePoints?: BABYLON.Vector3[];
    private _prevSegment?: Track;
    get prevSegment():Track { return this._prevSegment;};
    private _nextSegment?: Track;
    get nextSegment():Track { return this._nextSegment;};
    private mesh: BABYLON.Mesh;

    constructor(a: TrackCreatorListElement, b: TrackCreatorListElement, c?: TrackCreatorListElement) {
        this.PA = new BABYLON.Vector3(a.x, 0, a.z);
        this.PB = new BABYLON.Vector3(b.x, 0, b.z);
        if (c) {
            this.PI = [new BABYLON.Vector3(c.x, 0, c.z)];
            const bezier = BABYLON.Curve3.CreateQuadraticBezier(this.PA, this.PI[0], this.PB, 20);
            this.curvePoints = bezier.getPoints();
            this.length = bezier.length();
            this.isCurve = true;
        } else {
            // this.length = Math.sqrt(Math.pow(Math.abs(a.x - b.x),2) + Math.pow(Math.abs(a.z - b.z),2));
            // this.curvePoints = [this.PA, this.PB];
            const bezier = BABYLON.Curve3.CreateQuadraticBezier(this.PA, new BABYLON.Vector3(
                (this.PA.x+this.PB.x)/2,
                (this.PA.y+this.PB.y)/2,
                (this.PA.z+this.PB.z)/2
            ), this.PB, 20);
            this.curvePoints = bezier.getPoints();
            this.length = bezier.length();

            this.isCurve = false;
        }
    }

    setSegments(prev: Track, next: Track) {
        if (prev) { this._prevSegment = prev; }
        if (next) { this._nextSegment = next; }
    }

    render(scene: BABYLON.Scene) {
        const track = BABYLON.MeshBuilder.CreateLines(
            'track',
            {points: this.curvePoints},
            scene);
        track.color = new BABYLON.Color3(0, 0, 0);
        this.mesh = track;
        return track;
    }

    renderDashed(scene: BABYLON.Scene) {
        const track = BABYLON.MeshBuilder.CreateDashedLines(
            'track',
            {points: this.curvePoints, dashSize: 1, gapSize: 7},
            scene);
        track.color = new BABYLON.Color3(0, 0, 0);
        this.mesh = track;
        return track;
    }

    hide() {
        this.mesh.setEnabled(false);
    }

    show() {
        this.mesh.setEnabled(true);
    }

    connectBA(other: Track) {
        this._nextSegment = other;
        other.setSegments(this, null);
    }

    disconnectBA() {
        this.nextSegment.removeA();
        this._nextSegment = null;
    }

    removeA() {
        this._prevSegment = null;
    }

    connectAB(other: Track) {
        this._prevSegment = other;
        other.setSegments(null, this);
    }

    disconnectAB() {
        this.prevSegment.removeB();
        this._prevSegment = null;
    }

    removeB() {
        this._nextSegment = null;
    }
}
