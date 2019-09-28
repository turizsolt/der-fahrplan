import * as BABYLON from "babylonjs";
import {Track} from "./track";

export class Engine {
    private track:Track;
    private position:BABYLON.Vector3;
    private rotation: number;
    private positionOnTrack: number;
    private renderEngine: BABYLON.Mesh;

    putOnTrack(track: Track) {
        this.track = track;
        this.position = track.PA;
        this.positionOnTrack = 0;
    }

    render(scene: BABYLON.Scene) {
        this.renderEngine = BABYLON.Mesh.CreateBox("box", 3, scene);
        this.renderEngine.position = this.position;

        var boxMaterial = new BABYLON.StandardMaterial("boxMat", scene);
        boxMaterial.diffuseColor = new BABYLON.Color3(1,0,0);
        this.renderEngine.material = boxMaterial;
        return this.renderEngine;
    }

    forward() {
        this.positionOnTrack += 0.1;
        if (this.positionOnTrack > this.track.length) {
            const trackLength = this.track.length;
            if(this.track.nextSegment) {
                this.track = this.track.nextSegment;
                this.positionOnTrack -= trackLength;
            } else {
                this.positionOnTrack = trackLength;
            }
        }

        this.reposition();
    }

    backward() {
        this.positionOnTrack -= 0.1;
        if (this.positionOnTrack < 0) {
            if(this.track.prevSegment) {
                this.track = this.track.prevSegment;
                const prevTrackLength = this.track.length;
                this.positionOnTrack += prevTrackLength;
            } else {
                this.positionOnTrack = 0;
            }
        }

        this.reposition();
    }

    reposition() {
        if(this.track.isCurve) {
            const t = this.positionOnTrack / this.track.length;
            var p = new BABYLON.Vector3(
                (1 - t) * (1 - t) * this.track.PA.x + 2 * (1 - t) * t * this.track.PI[0].x + t * t * this.track.PB.x,
                0,
                (1 - t) * (1 - t) * this.track.PA.z + 2 * (1 - t) * t * this.track.PI[0].z + t * t * this.track.PB.z,
            );
            var pd = new BABYLON.Vector3(
                2 * (1 - t) * (this.track.PI[0].x - this.track.PA.x) + 2 * t * (this.track.PB.x - this.track.PI[0].x),
                0,
                2 * (1 - t) * (this.track.PI[0].z - this.track.PA.z) + 2 * t * (this.track.PB.z - this.track.PI[0].z),
            );

            this.position = p;
            this.renderEngine.position = p;

            const rot = Math.atan2(pd.x, pd.z);
            this.rotation = rot;
            this.renderEngine.rotation.y = rot;
        } else {
            const t = this.positionOnTrack / this.track.length;
            var p = new BABYLON.Vector3(
                (1 - t) * this.track.PA.x + t * this.track.PB.x,
                0,
                (1 - t) * this.track.PA.z + t * this.track.PB.z,
            );
            var pd = new BABYLON.Vector3(
                this.track.PB.x - this.track.PA.x,
                0,
                this.track.PB.z - this.track.PA.z,
            );

            this.position = p;
            this.renderEngine.position = p;

            const rot = Math.atan2(pd.x, pd.z);
            this.rotation = rot;
            this.renderEngine.rotation.y = rot;
        }
    }
}
