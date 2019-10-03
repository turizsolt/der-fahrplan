import * as BABYLON from "babylonjs";
import {Engine} from "./Engine";
import {Platform} from "./Platform";

export class Passenger {
    readonly id: number;
    private onPlatform: Platform = null;
    private onEngine: Engine = null;
    private mesh:BABYLON.Mesh;
    private position: BABYLON.Vector3;
    private shift: BABYLON.Vector3;

    constructor(readonly to: Platform, readonly from: Platform, readonly scene: BABYLON.Scene) {
        this.id = Math.random() * 1000000 | 0;
        this.onPlatform = from;

        const dist = Math.random()*2;
        const rad = Math.random()*Math.PI*2;
        this.shift = new BABYLON.Vector3(Math.sin(rad)*dist,0, Math.cos(rad)*dist);

        this.position = from.position.clone().add(new BABYLON.Vector3(0, 2.5, 0)).add(this.shift);
    }

    render() {
        console.log('passenger created', this.id, this.from.no, "->", this.to.no);

        this.mesh = BABYLON.MeshBuilder.CreateBox("box", {height: 0.5, width: 0.5, depth: 0.5}, this.scene);
        this.mesh.position = this.position;

        var boxMaterial = new BABYLON.StandardMaterial("boxMat", this.scene);
        boxMaterial.diffuseColor = new BABYLON.Color3(1,1,0);
        this.mesh.material = boxMaterial;
        return this.mesh;
    }

    updatePosition() {
        if(this.onPlatform) {
            this.position = this.onPlatform.position.clone().add(new BABYLON.Vector3(0, 2.5, 0).add(this.shift));
            this.mesh.position = this.position;
        } else if(this.onEngine) {
            this.position = this.onEngine.position.clone().add(new BABYLON.Vector3(0, 2.5, 0).add(this.shift));
            this.mesh.position = this.position;
        } else {
            this.mesh.setEnabled(false);
        }
    }

    checkTrain(engine: Engine) {
        console.log('check engine', this.id);
        engine.getOn(this);
        this.onEngine = engine;

        this.onPlatform.removePassenger(this);
        this.onPlatform = null;

        this.updatePosition();
    }

    checkPlatform(platform: Platform) {
        console.log('check platform', this.id);
        if(platform === this.to) {
            this.onEngine.getOff(this);
            this.onEngine = null;

            this.updatePosition();
        }
    }
}
