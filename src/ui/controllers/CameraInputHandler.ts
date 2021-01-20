import * as BABYLON from 'babylonjs';
import { InputHandler } from './InputHandler';
import { InputProps } from './InputProps';
import { Vector3 } from 'babylonjs';
import { TickInputProps } from './TickInputProps';

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

  tick(props: TickInputProps): void {
    const alpha = this.camera.alpha;
    const scale = this.camera.radius / 70;
    let dx = 0;
    let dz = 0;

    const percX = (props.pointerX - 260) / (props.canvasWidth - 260);
    const percY = props.pointerY / props.canvasHeight;
    console.log(percX, percY);

    if (props.canvasWidth - props.pointerX < 20) {
      const offset = props.canvasWidth - props.pointerX;
      const modifier = (20 - offset) / 20;
      dx += -Math.sin(alpha) * scale * modifier;
      dz += Math.cos(alpha) * scale * modifier;
    }

    if (props.pointerX < 20) {
      const modifier = (20 - props.pointerX) / 20;
      dx += -Math.sin(alpha + Math.PI) * scale * modifier;
      dz += Math.cos(alpha + Math.PI) * scale * modifier;
    }

    if (props.canvasHeight - props.pointerY < 20) {
      const offset = props.canvasHeight - props.pointerY;
      const modifier = (20 - offset) / 20;
      dx += -Math.sin(alpha + Math.PI / 2 * 3) * scale * modifier;
      dz += Math.cos(alpha + Math.PI / 2 * 3) * scale * modifier;
    }

    if (props.pointerY < 20) {
      const modifier = (20 - props.pointerY) / 20;
      dx += -Math.sin(alpha + Math.PI / 2) * scale * modifier;
      dz += Math.cos(alpha + Math.PI / 2) * scale * modifier;
    }


    if (dz !== 0 || dx !== 0) {
      this.camera.setPosition(
        new Vector3(
          props.fromX + dx,
          props.fromY,
          props.fromZ + dz
        )
      );
      this.camera.setTarget(
        new Vector3(props.targetX + dx, 0, props.targetZ + dz)
      );
    }
  }

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
