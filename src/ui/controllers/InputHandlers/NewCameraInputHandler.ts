import * as BABYLON from 'babylonjs';
import { NewInputHandler } from './NewInputHandler';
import { WheelNeg, WheelPos, MouseMiddle } from './Interfaces/InputType';
import { wheel, move, drag } from './Interfaces/Helpers';
import { Store } from '../../../structs/Interfaces/Store';
import { GUISpecificController } from '../GUISpecificController';
import { BabylonController } from '../BabylonController';
import { InputMod } from './Interfaces/InputMod';

export class NewCameraInputHandler extends NewInputHandler {
  // todo babylon
  private camera: BABYLON.ArcRotateCamera;
  private babylonController: BabylonController;
  private cameraDownProps: any;

  constructor(
    private store: Store,
    private specificController: GUISpecificController
  ) {
    super();

    if (globalThis.startParam === '2d') {
      // pixi - todo
    } else {
      // babylon - todo

      this.babylonController = this.specificController as BabylonController;
      this.camera = this.babylonController.getCamera();

      // zoom

      this.reg(wheel(WheelNeg), () => {
        this.camera.radius *= 1.2;
      });

      this.reg(wheel(WheelPos), () => {
        this.camera.radius /= 1.2;
      });

      // pan

      // orbit

      this.reg(drag(MouseMiddle), () => {
        this.cameraDownProps = this.babylonController.getProps();
      });

      this.reg(move(MouseMiddle, InputMod.Shift), () => {
        const cameraProps = this.babylonController.getProps();
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
      });

      this.reg(move(MouseMiddle, InputMod.Ctrl), () => {
        const cameraProps = this.babylonController.getProps();
        this.camera.radius =
          this.cameraDownProps.cameraRadius +
          (cameraProps.pointerY - this.cameraDownProps.pointerY);
      });
    }
  }
}
