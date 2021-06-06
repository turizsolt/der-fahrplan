import * as BABYLON from 'babylonjs';
import { InputHandler } from './InputHandler';
import { InputProps } from './InputProps';
import { Vector3 } from 'babylonjs';
import { TickInputProps } from './TickInputProps';
import { GUISpecificController } from './GUISpecificController';
import { BabylonController } from './BabylonController';

export class CameraInputHandler implements InputHandler {
  private mouseButton: boolean[] = [];
  private camera: BABYLON.ArcRotateCamera;
  private cameraDownProps: any;
  private babylonController: BabylonController;

  constructor(specificController: GUISpecificController) {
    this.babylonController = specificController as BabylonController;
    this.camera = this.babylonController.getCamera();
  }

  private panLock: boolean = true;

  setPanLock() {
    this.panLock = !this.panLock;
  }

  down(props: InputProps, event: PointerEvent): void {
    this.mouseButton[event.button] = true;
    this.cameraDownProps = this.babylonController.getProps();
  }

  roam(props: InputProps, event: PointerEvent): void {}

  tick(props: TickInputProps): void {
    if (this.panLock) return;

    const cameraProps = this.babylonController.getProps();

    const alpha = this.camera.alpha;
    const scale = this.camera.radius / 70;
    let dx = 0;
    let dz = 0;

    if (props.canvasWidth - cameraProps.pointerX < 20) {
      const offset = props.canvasWidth - cameraProps.pointerX;
      const modifier = (20 - offset) / 20;
      dx += -Math.sin(alpha) * scale * modifier;
      dz += Math.cos(alpha) * scale * modifier;
    }

    if (cameraProps.pointerX < 20) {
      const modifier = (20 - cameraProps.pointerX) / 20;
      dx += -Math.sin(alpha + Math.PI) * scale * modifier;
      dz += Math.cos(alpha + Math.PI) * scale * modifier;
    }

    if (props.canvasHeight - cameraProps.pointerY < 20) {
      const offset = props.canvasHeight - cameraProps.pointerY;
      const modifier = (20 - offset) / 20;
      dx += -Math.sin(alpha + (Math.PI / 2) * 3) * scale * modifier;
      dz += Math.cos(alpha + (Math.PI / 2) * 3) * scale * modifier;
    }

    if (cameraProps.pointerY < 20) {
      const modifier = (20 - cameraProps.pointerY) / 20;
      dx += -Math.sin(alpha + Math.PI / 2) * scale * modifier;
      dz += Math.cos(alpha + Math.PI / 2) * scale * modifier;
    }

    if (dz !== 0 || dx !== 0) {
      this.camera.setPosition(
        new Vector3(
          cameraProps.fromX + dx,
          cameraProps.fromY,
          cameraProps.fromZ + dz
        )
      );
      this.camera.setTarget(
        new Vector3(cameraProps.targetX + dx, 0, cameraProps.targetZ + dz)
      );
      props.setFollowCamOff();
    }
  }

  move(downProps: InputProps, props: InputProps, event: PointerEvent): void {
    const cameraProps = this.babylonController.getProps();
    if (event.shiftKey || this.mouseButton[1]) {
      this.camera.alpha =
        this.cameraDownProps.cameraAlpha +
        (cameraProps.pointerX - this.cameraDownProps.pointerX) / 100;

      this.camera.beta =
        this.cameraDownProps.cameraBeta +
        (cameraProps.pointerY - this.cameraDownProps.pointerY) / 300;
      if (this.camera.beta > Math.PI * 0.45) {
        this.camera.beta = Math.PI * 0.45;
      }
      if (this.camera.beta < Math.PI * 0) {
        this.camera.beta = Math.PI * 0;
      }
    } else if (event.ctrlKey) {
      this.camera.radius =
        this.cameraDownProps.cameraRadius +
        (cameraProps.pointerY - this.cameraDownProps.pointerY);
    }
  }

  click(downProps: InputProps, event: PointerEvent): void {}

  up(downProps: InputProps, props: InputProps, event: PointerEvent): void {}

  cancel(): void {}
}
