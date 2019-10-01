import * as BABYLON from "babylonjs";

export class TrackSegment {
    readonly length: number;
    readonly isCurve: boolean;
    readonly curvePoints?: BABYLON.Vector3[];

    constructor(a: BABYLON.Vector3, b: BABYLON.Vector3, i?: BABYLON.Vector3, mustCurve: boolean = false) {
        if(!i && mustCurve) {
            i = new BABYLON.Vector3(
                (a.x+b.x)/2,
                (a.y+b.y)/2,
                (a.z+b.z)/2
            );
        }

        if (i) {
            const bezier = BABYLON.Curve3.CreateQuadraticBezier(a, i, b, 20);
            this.curvePoints = bezier.getPoints();
            this.length = bezier.length();
            this.isCurve = true;
        } else {
            this.length = Math.sqrt(Math.pow(Math.abs(a.x - b.x),2) + Math.pow(Math.abs(a.z - b.z),2));
            this.curvePoints = [a, b];
            this.isCurve = false;
        }
    }
}
