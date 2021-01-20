import * as BABYLON from 'babylonjs';
import { InputHandler } from './InputHandler';
import { InputProps } from './InputProps';
import { Vector3 } from 'babylonjs';

export class CameraInputHandler implements InputHandler {
  private mouseButton: boolean[] = [];
  private lastProps: InputProps;
  private mesh: BABYLON.AbstractMesh;

  constructor(private camera: BABYLON.ArcRotateCamera) {
    this.mesh = BABYLON.MeshBuilder.CreateCylinder(
      'placeholder-1',
      {
        diameter: 3,
        tessellation: 24,
        height: 2,
        updatable: true
      },
      null
    );
    const mat = new BABYLON.StandardMaterial('boxMat', null);
    mat.diffuseColor = new BABYLON.Color3(1, 1, 0);
    this.mesh.material = mat;
    this.mesh.setEnabled(false);
    this.mesh.isPickable = false;
  }

  down(props: InputProps, event: PointerEvent): void {
    this.mouseButton[event.button] = true;
    this.lastProps = props;

    this.mesh.setEnabled(true);
    this.mesh.position = new Vector3(props.targetX, 0, props.targetZ);
  }

  roam(props: InputProps, event: PointerEvent): void { }

  move(downProps: InputProps, props: InputProps, event: PointerEvent): void {
    if (event.shiftKey || this.mouseButton[1]) {
      this.camera.alpha =
        downProps.cameraAlpha + (props.pointerX - downProps.pointerX) / 100;

      this.camera.beta =
        downProps.cameraBeta + (props.pointerY - downProps.pointerY) / 300;
      if (this.camera.beta > Math.PI * 0.45) {
        this.camera.beta = Math.PI * 0.45;
      }
      if (this.camera.beta < Math.PI * 0) {
        this.camera.beta = Math.PI * 0;
      }
    } else if (event.ctrlKey) {
      this.camera.radius =
        downProps.cameraRadius + (props.pointerY - downProps.pointerY);
    }
  }

  click(downProps: InputProps, event: PointerEvent): void { }

  up(downProps: InputProps, props: InputProps, event: PointerEvent): void {
    this.mouseButton[event.button] = false;
    this.mesh.setEnabled(false);
  }

  cancel(): void {
    this.mesh.setEnabled(false);
  }
}
