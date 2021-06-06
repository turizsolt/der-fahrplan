import * as BABYLON from 'babylonjs';
import { GUISpecificController } from './GUISpecificController';
import { Vector3 } from 'babylonjs';
import { Coordinate } from '../../structs/Geometry/Coordinate';

export class BabylonController implements GUISpecificController {
  constructor(
    private scene: BABYLON.Scene,
    private camera: BABYLON.ArcRotateCamera
  ) {}

  getCamera(): BABYLON.ArcRotateCamera {
    return this.camera;
  }

  getProps() {
    return {
      cameraRadius: this.camera.radius,
      cameraAlpha: this.camera.alpha,
      cameraBeta: this.camera.beta,
      pointerX: this.scene.pointerX,
      pointerY: this.scene.pointerY,
      targetX: this.camera.target.x,
      targetZ: this.camera.target.z,
      fromX: this.camera.position.x,
      fromY: this.camera.position.y,
      fromZ: this.camera.position.z
    };
  }

  pick(): BABYLON.PickingInfo {
    return this.scene.pick(this.scene.pointerX, this.scene.pointerY);
  }

  modRadius(value: number): void {
    this.camera.radius *= value;
  }

  setFollowCam(coord: Coordinate): void {
    const dx = coord.x - this.camera.target.x;
    const dz = coord.z - this.camera.target.z;

    this.camera.setPosition(
      new Vector3(
        this.camera.position.x + dx,
        this.camera.position.y,
        this.camera.position.z + dz
      )
    );
    this.camera.setTarget(
      new Vector3(this.camera.target.x + dx, 0, this.camera.target.z + dz)
    );
  }

  getFps(): string {
    return this.camera
      .getEngine()
      .getFps()
      .toFixed();
  }

  saveSpecific(): any {
    return {
      camera: this.saveCamera()
    };
  }

  loadSpecific(obj: any): void {
    if (obj.camera) {
      this.loadCamera(obj.camera);
    }
  }

  private saveCamera(): any {
    return {
      alpha: this.camera.alpha,
      beta: this.camera.beta,
      radius: this.camera.radius,
      target: {
        x: this.camera.target.x,
        y: this.camera.target.y,
        z: this.camera.target.z
      },
      position: {
        x: this.camera.position.x,
        y: this.camera.position.y,
        z: this.camera.position.z
      }
    };
  }

  private loadCamera(camera: any) {
    this.camera.alpha = camera.alpha;
    this.camera.beta = camera.beta;
    this.camera.radius = camera.radius;
    this.camera.setTarget(
      new Vector3(camera.target.x, camera.target.y, camera.target.z)
    );
    this.camera.setPosition(
      new Vector3(camera.position.x, camera.position.y, camera.position.z)
    );
  }
}
