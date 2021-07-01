import * as BABYLON from 'babylonjs';
import { NewInputHandler } from './NewInputHandler';
import { WheelNeg, WheelPos, MouseMiddle } from './Interfaces/InputType';
import {
  wheel,
  move,
  drag,
  tick,
  keyDown,
  keyHold
} from './Interfaces/Helpers';
import { Store } from '../../../structs/Interfaces/Store';
import { GUISpecificController } from '../GUISpecificController';
import { BabylonController } from '../BabylonController';
import { InputMod } from './Interfaces/InputMod';
import { TickInputProps } from '../TickInputProps';
import { Wagon } from '../../../structs/Interfaces/Wagon';
import { PanObject } from './PanObject';

export class NewCameraInputHandler extends NewInputHandler {
  // todo babylon
  private camera: BABYLON.ArcRotateCamera;
  private babylonController: BabylonController;
  private cameraDownProps: any;
  private panLock: boolean = true;
  private followCam: boolean = false;
  private panObject: PanObject;

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
      this.panObject = new PanObject(this.camera);

      // zoom

      this.reg(wheel(WheelNeg), () => {
        this.camera.radius *= 1.2;
      });

      this.reg(wheel(WheelPos), () => {
        this.camera.radius /= 1.2;
      });

      // pan

      this.reg(tick(), () => {
        this.pan();
        this.follow();
      });

      this.reg(keyDown('ScrollLock'), () => {
        this.panLock = !this.panLock;
      });

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

      // zoom 2

      this.reg(move(MouseMiddle, InputMod.Ctrl), () => {
        const cameraProps = this.babylonController.getProps();
        this.camera.radius =
          this.cameraDownProps.cameraRadius +
          (cameraProps.pointerY - this.cameraDownProps.pointerY);
      });
    }

    this.reg(keyHold('W'), () => {
      this.panObject.initVars();
      this.panObject.up(1);
      this.panObject.updateCamera(this.getPanProperties());
    });

    this.reg(keyHold('A'), () => {
      this.panObject.initVars();
      this.panObject.left(1);
      this.panObject.updateCamera(this.getPanProperties());
    });

    this.reg(keyHold('S'), () => {
      this.panObject.initVars();
      this.panObject.down(1);
      this.panObject.updateCamera(this.getPanProperties());
    });

    this.reg(keyHold('D'), () => {
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
