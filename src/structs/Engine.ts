import * as BABYLON from "babylonjs";
import {Track} from "./Track";
import {TrackBase} from "./TrackBase";

export class Engine {
    private track:TrackBase;
    private position:BABYLON.Vector3;
    private rotation: number;
    private positionOnTrack: number;
    private renderEngine: BABYLON.Mesh;

    putOnTrack(track: Track) {
        this.track = track;
        this.position = track.A.point;
        this.positionOnTrack = 0;
        track.checkin(this);
    }

    render(scene: BABYLON.Scene) {
        this.renderEngine = BABYLON.MeshBuilder.CreateBox("box", {height: 3, width: 3, depth: 10}, scene);
        this.renderEngine.position = this.position;

        var boxMaterial = new BABYLON.StandardMaterial("boxMat", scene);
        boxMaterial.diffuseColor = new BABYLON.Color3(1,0,0);
        this.renderEngine.material = boxMaterial;
        this.reposition();
        return this.renderEngine;
    }

    forward() {
        this.positionOnTrack += 1;
        if (this.positionOnTrack > this.track.segment.length) {
            const trackLength = this.track.segment.length;
            if(this.track.B.connectedTo) {
                this.track.checkout(this);
                this.track = this.track.B.connectedTo;
                this.track.checkin(this);
                this.positionOnTrack -= trackLength;
            } else {
                this.positionOnTrack = trackLength;
            }
        }
        this.reposition();
    }

    backward() {
        this.positionOnTrack -= 1;
        if (this.positionOnTrack < 0) {
            if(this.track.A.connectedTo) {
                this.track.checkout(this);
                this.track = this.track.A.connectedTo;
                this.track.checkin(this);
                const prevTrackLength = this.track.segment.length;
                this.positionOnTrack += prevTrackLength;
            } else {
                this.positionOnTrack = 0;
            }
        }

        this.reposition();
    }

    reposition() {
        if(this.track.I) {
            const t = this.positionOnTrack / this.track.segment.length;
            var p = new BABYLON.Vector3(
                (1 - t) * (1 - t) * this.track.A.point.x + 2 * (1 - t) * t * this.track.I.x + t * t * this.track.B.point.x,
                0,
                (1 - t) * (1 - t) * this.track.A.point.z + 2 * (1 - t) * t * this.track.I.z + t * t * this.track.B.point.z,
            );
            var pd = new BABYLON.Vector3(
                2 * (1 - t) * (this.track.I.x - this.track.A.point.x) + 2 * t * (this.track.B.point.x - this.track.I.x),
                0,
                2 * (1 - t) * (this.track.I.z - this.track.A.point.z) + 2 * t * (this.track.B.point.z - this.track.I.z),
            );

            this.position = p;
            this.renderEngine.position = p;

            const rot = Math.atan2(pd.x, pd.z);
            this.rotation = rot;
            this.renderEngine.rotation.y = rot;
        } else {
            const t = this.positionOnTrack / this.track.segment.length;
            var p = new BABYLON.Vector3(
                (1 - t) * this.track.A.point.x + t * this.track.B.point.x,
                0,
                (1 - t) * this.track.A.point.z + t * this.track.B.point.z,
            );
            var pd = new BABYLON.Vector3(
                this.track.B.point.x - this.track.A.point.x,
                0,
                this.track.B.point.z - this.track.A.point.z,
            );

            this.position = p;
            this.renderEngine.position = p;

            const rot = Math.atan2(pd.x, pd.z);
            this.rotation = rot;
            this.renderEngine.rotation.y = rot;
        }

        this.track.platformList.map(platform => {
            if(platform.start <= this.positionOnTrack && this.positionOnTrack <= platform.end) {
                if(!platform.isChecked(this)) {
                    platform.checkin(this);
                }
            } else {
                platform.checkout(this);
            }
        });
    }
}
