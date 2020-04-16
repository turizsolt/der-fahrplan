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

  roam(props: InputProps, event: PointerEvent): void {}

  move(downProps: InputProps, props: InputProps, event: PointerEvent): void {
    if (event.shiftKey) {
      this.camera.alpha =
        downProps.cameraAlpha + (props.pointerX - downProps.pointerX) / 100;

      this.camera.beta =
        downProps.cameraBeta + (props.pointerY - downProps.pointerY) / 100;
      if (this.camera.beta > Math.PI * 0.45) {
        this.camera.beta = Math.PI * 0.45;
      }
      if (this.camera.beta < Math.PI * 0) {
        this.camera.beta = Math.PI * 0;
      }
    } else if (event.ctrlKey) {
      this.camera.radius =
        downProps.cameraRadius + (props.pointerY - downProps.pointerY);
    } else {
      downProps = this.lastProps;
      if (props.point && downProps.point) {
        const dx = +(props.point.coord.x - downProps.point.coord.x);
        const dz = +(props.point.coord.z - downProps.point.coord.z);
        this.camera.setPosition(
          new Vector3(
            downProps.fromX + dx,
            downProps.fromY,
            downProps.fromZ + dz
          )
        );
        this.camera.setTarget(
          new Vector3(downProps.targetX + dx, 0, downProps.targetZ + dz)
        );
        this.mesh.position = new Vector3(
          downProps.targetX + dx,
          0,
          downProps.targetZ + dz
        );
      } else {
        this.cancel();
      }
      this.lastProps = props;
    }
  }

  click(downProps: InputProps, event: PointerEvent): void {}

  up(downProps: InputProps, props: InputProps, event: PointerEvent): void {
    this.mouseButton[event.button] = false;
    this.mesh.setEnabled(false);
  }

  cancel(): void {
    this.mesh.setEnabled(false);
  }
}
