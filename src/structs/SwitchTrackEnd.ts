import * as BABYLON from "babylonjs";
import {Switch} from "./Switch";
import {TrackBase} from "./TrackBase";
import {TrackEnd} from "./TrackEnd";

export class SwitchTrackEnd extends TrackEnd {
    readonly point: BABYLON.Vector3;
    readonly endOf: Switch;
    private phisicallyConnectedTo: TrackBase;
    private _phisicallyConnectedToEnd: TrackEnd;
    get phisicallyCconnectedToEnd() {return this._phisicallyConnectedToEnd};
    private _active: boolean;
    set active(a: boolean) {this._active = a};

    connect(other: TrackEnd) {
        this.phisicallyConnectedTo = other.endOf;
        this._phisicallyConnectedToEnd = other;
        if(other.connectedTo !== this.endOf) {
            // todo: nem lesz ebből végtelen ciklus, ha két váltót összekötök?
            other.connect(this);
        }

        if(this._active) {
            this.reconnect();
        }
    }

    reconnect() {
        this._connectedTo = this.phisicallyConnectedTo;
        this._connectedToEnd = this.phisicallyCconnectedToEnd;
        if(this.phisicallyCconnectedToEnd.connectedTo !== this.endOf) {
            this.phisicallyCconnectedToEnd.connect(this);
        }
    }
}
