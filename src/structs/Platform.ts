import * as BABYLON from "babylonjs";
import {Engine} from "./Engine";
import {Side} from "./Side";
import {TrackBase} from "./TrackBase";

export class Platform {
    private mesh: BABYLON.Mesh;
    private position: BABYLON.Vector3;
    private rotation: number;
    carList: Engine[];

    private blue: BABYLON.StandardMaterial;
    private red: BABYLON.StandardMaterial;

    constructor(readonly no: string, readonly track: TrackBase, readonly start: number, readonly end: number,
                readonly width: number, readonly side: Side) {
        track.addPlatform(this);

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

        this.carList = [];
    }

    render(scene: BABYLON.Scene) {
        this.mesh = BABYLON.MeshBuilder.CreateBox("platform-"+this.no, {width: this.width, height: 1.5, depth: (this.end - this.start)}, scene);
        this.mesh.position = this.position;
        this.mesh.rotation.y = this.rotation;

        this.blue = new BABYLON.StandardMaterial("blue", scene);
        this.blue.diffuseColor = new BABYLON.Color3(0,this.side === Side.Left ? 1 : 0.6,1);

        this.red = new BABYLON.StandardMaterial("red", scene);
        this.red.diffuseColor = new BABYLON.Color3(1,0, 0);

        var textureResolution = 100;
        var textureGround = new BABYLON.DynamicTexture(this.no, {width:100, height:50}, scene, false);
        var textureContext = textureGround.getContext();
        var font = "bold 48px monospace";
        textureGround.drawText(this.no, 5, 45, font, "black", "white", true, true);

        this.blue.diffuseTexture = textureGround;

        this.mesh.material = this.blue;
        return this.mesh;
    }

    checkin(engine:Engine) {
        this.carList.push(engine);

        this.mesh.material = this.red;
    }

    checkout(engine:Engine) {
        this.carList = this.carList.filter(elem => elem !== engine);
        if(this.carList.length === 0) {
            this.mesh.material = this.blue;
        }
    }

    isChecked(engine:Engine) {
        return this.carList.filter(elem => elem === engine).length > 0;
    }
}
