import * as BABYLON from "babylonjs";
import {TrackBase} from "./TrackBase";

export class TrackEnd {
    readonly point: BABYLON.Vector3;
    readonly endOf: TrackBase;
    protected _connectedTo: TrackBase;
    get connectedTo() {return this._connectedTo};
    protected _connectedToEnd: TrackEnd;
    get connectedToEnd() {return this._connectedToEnd};

    constructor(point: BABYLON.Vector3, endOf: TrackBase) {
        this.point = point;
        this.endOf = endOf;
    }

    connect(other: TrackEnd) {
        this._connectedTo = other.endOf;
        this._connectedToEnd = other;
        if(other.connectedTo !== this.endOf) {
            other.connect(this);
        }
    }

    disconnect() {
        if(this.connectedToEnd) {
            const temp = this.connectedToEnd;
            this._connectedTo = null;
            this._connectedToEnd = null;
            temp.disconnect();
        }
    }
}
