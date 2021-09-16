import * as BABYLON from 'babylonjs';
import { CoordinateToBabylonVector3 } from '../../../babylon/converters/CoordinateToBabylonVector3';
import { CreateWaitingHallInputHandlerPlugin } from './CreateWaitingHallInputHandlerPlugin';
import { Coordinate } from '../../../../structs/Geometry/Coordinate';

export class CreateWaitingHallInputHandlerBabylon
    implements CreateWaitingHallInputHandlerPlugin {
    private fromMesh: BABYLON.Mesh;
    private toMesh: BABYLON.Mesh;

    constructor() { }

    init() {
        this.fromMesh = BABYLON.MeshBuilder.CreateBox(
            'name',
            { height: 1, width: 1, depth: 1 },
            null
        );
        this.fromMesh.setEnabled(false);
        this.fromMesh.isPickable = false;
        this.fromMesh.position.y = 0.75;

        this.toMesh = BABYLON.MeshBuilder.CreateBox(
            'name',
            { height: 1, width: 1, depth: 1 },
            null
        );
        this.toMesh.setEnabled(false);
        this.toMesh.isPickable = false;
        this.toMesh.position.y = 0.75;
    }

    setFrom(renderable: boolean, point?: Coordinate): void {
        this.fromMesh.setEnabled(renderable);
        if (point) {
            this.fromMesh.position = CoordinateToBabylonVector3(point);
        }
    }

    setTo(renderable: boolean, point?: Coordinate): void {
        this.toMesh.setEnabled(renderable);
        if (point) {
            this.toMesh.position = CoordinateToBabylonVector3(point);
        }
    }

    up(): void {
        this.cancel();
    }

    click(): void {
        this.cancel();
    }

    cancel(): void {
        this.fromMesh.setEnabled(false);
        this.toMesh.setEnabled(false);
    }
}
