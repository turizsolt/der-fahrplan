import * as BABYLON from 'babylonjs';
import { CoordinateToBabylonVector3 } from '../../../babylon/converters/CoordinateToBabylonVector3';
import { CreatePlatformInputHandlerPlugin } from './CreatePlatformInputHandlerPlugin';
import { Coordinate } from '../../../../structs/Geometry/Coordinate';
import { curveToTube } from '../../../babylon/TrackBabylonRenderer';
import { BezierCreater } from '../../../../structs/Geometry/Bezier/BezierCreater';

export class CreatePlatformInputHandlerBabylon
  implements CreatePlatformInputHandlerPlugin {
  private fromMesh: BABYLON.Mesh;
  private toMesh: BABYLON.Mesh;
  private pathMesh: BABYLON.Mesh;

  constructor() {}

  init() {
    const mat = new BABYLON.StandardMaterial('boxMat', null);
    mat.diffuseColor = new BABYLON.Color3(0, 1, 0);

    this.fromMesh = BABYLON.MeshBuilder.CreateCylinder(
      'placeholder-1',
      {
        diameter: 3,
        tessellation: 24,
        height: 10,
        updatable: true
      },
      null
    );
    this.fromMesh.material = mat;
    this.fromMesh.setEnabled(false);
    this.fromMesh.isPickable = false;

    this.toMesh = BABYLON.MeshBuilder.CreateCylinder(
      'placeholder-2',
      {
        diameter: 3,
        tessellation: 24,
        height: 10,
        updatable: true
      },
      null
    );
    this.toMesh.material = mat;
    this.toMesh.setEnabled(false);
    this.toMesh.isPickable = false;

    this.pathMesh = curveToTube(
      BezierCreater.Create([
        new Coordinate(0, 0, 0),
        new Coordinate(0, 0, 1),
        new Coordinate(0, 0, 2)
      ])
        .getLineSegmentChain()
        .getPoints()
        .map(CoordinateToBabylonVector3),
      false
    );
    this.pathMesh.setEnabled(false);
  }

  down(renderable: boolean, point?: Coordinate): void {
    this.fromMesh.setEnabled(renderable);
    if (point) {
      this.fromMesh.position = CoordinateToBabylonVector3(point);
    }
  }

  roam(renderable: boolean, point?: Coordinate): void {
    this.down(renderable, point);
  }

  move(renderable: boolean, point?: Coordinate): void {
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
    this.pathMesh.setEnabled(false);
  }
}
