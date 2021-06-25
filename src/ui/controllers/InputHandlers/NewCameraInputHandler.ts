import * as BABYLON from 'babylonjs';
import { NewInputHandler } from './NewInputHandler';
import { WheelNeg, WheelPos } from './Interfaces/InputType';
import { wheel } from './Interfaces/Helpers';
import { Store } from '../../../structs/Interfaces/Store';
import { GUISpecificController } from '../GUISpecificController';
import { BabylonController } from '../BabylonController';

export class NewCameraInputHandler extends NewInputHandler {
  private camera: BABYLON.ArcRotateCamera;
  private babylonController: BabylonController;

  // babylon - todo

  constructor(
    private store: Store,
    private specificController: GUISpecificController
  ) {
    super();

    this.babylonController = this.specificController as BabylonController;
    this.camera = this.babylonController.getCamera();

    // zoom

    this.reg(wheel(WheelNeg), () => {
      this.camera.radius *= 1.2;
    });

    this.reg(wheel(WheelPos), () => {
      this.camera.radius /= 1.2;
    });
  }
}
