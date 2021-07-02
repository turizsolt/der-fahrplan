import * as BABYLON from 'babylonjs';
import { WheelNeg, WheelPos, MouseMiddle } from '../Interfaces/InputType';
import {
  wheel,
  move,
  drag,
  tick,
  keyDown,
  keyHold
} from '../Interfaces/Helpers';
import { Store } from '../../../../structs/Interfaces/Store';
import { GUISpecificController } from '../../GUISpecificController';
import { BabylonController } from '../../BabylonController';
import { InputMod } from '../Interfaces/InputMod';
import { TickInputProps } from '../../TickInputProps';
import { Wagon } from '../../../../structs/Interfaces/Wagon';
import { PanObject } from './PanObject';
import { CameraInputProps } from './CameraInputProps';
import { CameraInputHandlerPlugin } from './CameraInputHandlerPlugin';
import { CameraInputHandler } from './CameraInputHandler';

export class CameraInputHandlerBabylon implements CameraInputHandlerPlugin {
  private camera: BABYLON.ArcRotateCamera;
  private babylonController: BabylonController;
  private cameraDownPropsCamera: CameraInputProps;
  private cameraDownProps: TickInputProps;
  private panLock: boolean = true;
  private followCam: boolean = false;
  private panObject: PanObject;

  constructor(
    private store: Store,
    private specificController: GUISpecificController,
    private cameraHandler: CameraInputHandler
  ) {}

  init() {
    this.babylonController = this.specificController as BabylonController;
    this.camera = this.babylonController.getCamera();
    this.panObject = new PanObject(this.camera);

    // zoom

    this.cameraHandler.reg(wheel(WheelNeg), () => {
      this.camera.radius /= 1.2;
    });

    this.cameraHandler.reg(wheel(WheelPos), () => {
      this.camera.radius *= 1.2;
    });

    // pan

    this.cameraHandler.reg(tick(), () => {
      this.pan();
      this.follow();
    });

    this.cameraHandler.reg(keyDown('ScrollLock'), () => {
      this.panLock = !this.panLock;
    });

    // down

    this.cameraHandler.reg(drag(MouseMiddle), () => {
      this.cameraDownPropsCamera = this.babylonController.getProps();
      this.cameraDownProps = this.getPanProperties();
    });

    // orbit

    this.cameraHandler.reg(move(MouseMiddle, InputMod.Shift), () => {
      const cameraProps = this.babylonController.getProps();
      this.camera.alpha =
        this.cameraDownPropsCamera.cameraAlpha +
        (cameraProps.pointerX - this.cameraDownPropsCamera.pointerX) / 100;

      this.camera.beta =
        this.cameraDownPropsCamera.cameraBeta +
        (cameraProps.pointerY - this.cameraDownPropsCamera.pointerY) / 300;
      if (this.camera.beta > Math.PI * 0.45) {
        this.camera.beta = Math.PI * 0.45;
      }
      if (this.camera.beta < Math.PI * 0) {
        this.camera.beta = Math.PI * 0;
      }
    });

    // zoom 2

    this.cameraHandler.reg(move(MouseMiddle, InputMod.Ctrl), () => {
      const cameraProps = this.babylonController.getProps();
      this.camera.radius =
        this.cameraDownPropsCamera.cameraRadius +
        (cameraProps.pointerY - this.cameraDownPropsCamera.pointerY);
    });

    // pan2

    this.cameraHandler.reg(move(MouseMiddle), () => {
      const props = this.getPanProperties();
      const dx = this.cameraDownProps.camera.pointerX - props.camera.pointerX;
      const dy = this.cameraDownProps.camera.pointerY - props.camera.pointerY;
      this.panObject.initVars();
      this.panObject.move(dx, dy);
      this.panObject.updateCamera(this.cameraDownProps);
    });

    this.cameraHandler.reg(keyHold('W'), () => {
      this.panObject.initVars();
      this.panObject.up(1);
      this.panObject.updateCamera(this.getPanProperties());
    });

    this.cameraHandler.reg(keyHold('A'), () => {
      this.panObject.initVars();
      this.panObject.left(1);
      this.panObject.updateCamera(this.getPanProperties());
    });

    this.cameraHandler.reg(keyHold('S'), () => {
      this.panObject.initVars();
      this.panObject.down(1);
      this.panObject.updateCamera(this.getPanProperties());
    });

    this.cameraHandler.reg(keyHold('D'), () => {
      this.panObject.initVars();
      this.panObject.right(1);
      this.panObject.updateCamera(this.getPanProperties());
    });
  }

  private pan() {
    if (this.panLock) return;

    const props = this.getPanProperties();

    this.panObject.initVars();

    if (props.canvasWidth - props.camera.pointerX < 20) {
      const offset = props.canvasWidth - props.camera.pointerX;
      const modifier = (20 - offset) / 20;
      this.panObject.right(modifier);
    }

    if (props.camera.pointerX < 20) {
      const modifier = (20 - props.camera.pointerX) / 20;
      this.panObject.left(modifier);
    }

    if (props.canvasHeight - props.camera.pointerY < 20) {
      const offset = props.canvasHeight - props.camera.pointerY;
      const modifier = (20 - offset) / 20;
      this.panObject.down(modifier);
    }

    if (props.camera.pointerY < 20) {
      const modifier = (20 - props.camera.pointerY) / 20;
      this.panObject.up(modifier);
    }

    this.panObject.updateCamera(props);
  }

  private follow() {
    const selected = this.store.getSelected();
    if (
      this.followCam &&
      selected &&
      selected.getType() === Symbol.for('Wagon')
    ) {
      const wagon = selected as Wagon;
      this.specificController.setFollowCam(wagon.getRay().coord);
    }
  }

  private getPanProperties(): TickInputProps {
    return {
      canvasWidth: (document.getElementById(
        'renderCanvas'
      ) as HTMLCanvasElement).width,
      canvasHeight: (document.getElementById(
        'renderCanvas'
      ) as HTMLCanvasElement).height,
      setFollowCamOff: this.followCam
        ? () => {
            this.followCam = false;
          }
        : () => {},
      camera: this.babylonController.getProps()
    };
  }
}
