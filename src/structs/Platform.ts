import * as BABYLON from "babylonjs";
import {Side} from "./Side";
import {TrackBase} from "./TrackBase";

export class Platform {
    private mesh: BABYLON.Mesh;
    private position: BABYLON.Vector3;
    private rotation: number;

    constructor(readonly track: TrackBase, readonly start: number, readonly end: number,
                readonly width: number, readonly side: Side) {
        var rot = new BABYLON.Vector3(
            this.track.B.point.x - this.track.A.point.x,
            0,
            this.track.B.point.z - this.track.A.point.z,
        );
        const rot4 = Math.atan2(rot.x, rot.z);
        const rotLeft = rot4 - Math.PI/2;
        const rotRight = rot4 + Math.PI/2;

        var center = new BABYLON.Vector3(
            (this.track.B.point.x + this.track.A.point.x) / 2,
            0,
            (this.track.B.point.z + this.track.A.point.z) / 2,
        );

        var dist = 1.6 + width/2;
        var len = Math.sqrt(Math.pow(Math.abs(this.track.A.point.x - this.track.B.point.x),2) + Math.pow(Math.abs(this.track.A.point.z - this.track.B.point.z),2));
        var shift = new BABYLON.Vector3(
            Math.sin(side === Side.Left ? rotLeft : rotRight) * 1,
            0,
            Math.cos(side === Side.Left ? rotLeft : rotRight) * 1,
        );

        var dist2 = start + (end - start) / 2;
        var shift2 = new BABYLON.Vector3(
            this.track.A.point.x + rot.x / len * dist2,
            0,
            this.track.A.point.z + rot.z / len * dist2,
        );

        var height = new BABYLON.Vector3(0, -0.75,0);
        this.position = shift2.add(shift.scale(dist)).add(height);
        const rot1 = Math.atan2(rot.x, rot.z);
        this.rotation = rot1;
    }

    render(scene: BABYLON.Scene) {
        this.mesh = BABYLON.MeshBuilder.CreateBox("platform-"+(Math.random()*1000|0), {width: this.width, height: 1.5, depth: (this.end - this.start)}, scene);
        this.mesh.position = this.position;
        this.mesh.rotation.y = this.rotation;

        var meshMaterial = new BABYLON.StandardMaterial("boxMat", scene);
        meshMaterial.diffuseColor = new BABYLON.Color3(0,this.side === Side.Left ? 1 : 0,1);
        this.mesh.material = meshMaterial;
        return this.mesh;
    }
}
