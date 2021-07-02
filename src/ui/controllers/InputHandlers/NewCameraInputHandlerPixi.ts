import { WheelNeg, WheelPos, MouseMiddle } from './Interfaces/InputType';
import {
  wheel,
  move,
  drag,
  keyDown,
  keyHold,
  tick
} from './Interfaces/Helpers';
import { Store } from '../../../structs/Interfaces/Store';
import { GUISpecificController } from '../GUISpecificController';
import { InputMod } from './Interfaces/InputMod';
import { TickInputProps } from '../TickInputProps';
import { NewCameraInputHandlerPlugin } from './NewCameraInputHandlerPlugin';
import { NewCameraInputHandler } from './NewCameraInputHandler';
import { PixiController } from '../PixiController';

export class NewCameraInputHandlerPixi implements NewCameraInputHandlerPlugin {
  private panLock: boolean = true;
  private followCam: boolean = false;

  private pixiController: PixiController;
  private cameraDownPropsCamera: any;
  private cameraDownProps: TickInputProps;

  constructor(
    private store: Store,
    private specificController: GUISpecificController,
    private cameraHandler: NewCameraInputHandler
  ) {
    this.pixiController = this.specificController as PixiController;
  }

  init() {
    // zoom

    this.cameraHandler.reg(wheel(WheelNeg), () => {
      globalThis.stage.scale.x *= 1.2;
      globalThis.stage.scale.y *= 1.2;
    });

    this.cameraHandler.reg(wheel(WheelPos), () => {
      globalThis.stage.scale.x /= 1.2;
      globalThis.stage.scale.y /= 1.2;
    });

    // pan

    this.cameraHandler.reg(keyDown('ScrollLock'), () => {
      this.panLock = !this.panLock;
    });

    this.cameraHandler.reg(tick(), () => {
      this.pan();
      this.follow();
    });

    // down

    this.cameraHandler.reg(drag(MouseMiddle), () => {
      this.cameraDownPropsCamera = this.pixiController.getProps();
      this.cameraDownProps = this.getPanProperties();
    });

    // zoom 2

    this.cameraHandler.reg(move(MouseMiddle, InputMod.Ctrl), () => {
      const cameraProps = this.pixiController.getProps();

      let newValue =
        this.cameraDownPropsCamera.scale +
        (cameraProps.pointerY - this.cameraDownPropsCamera.pointerY) / 50;
      if (newValue < 0.1) newValue = 0.1;
      if (newValue > 100) newValue = 100;

      globalThis.stage.scale.x = newValue;
      globalThis.stage.scale.y = newValue;
      // todo change box
    });

    // pan2

    this.cameraHandler.reg(move(MouseMiddle), () => {
      const props = this.getPanProperties();
      const dx =
        this.cameraDownProps.camera2d.pointerX - props.camera2d.pointerX;
      const dy =
        this.cameraDownProps.camera2d.pointerY - props.camera2d.pointerY;
      globalThis.stage.x =
        this.cameraDownProps.camera2d.x + (dx * 10) / globalThis.stage.scale.x;
      globalThis.stage.y =
        this.cameraDownProps.camera2d.y + (dy * 10) / globalThis.stage.scale.x;
    });

    // pan3

    this.cameraHandler.reg(keyHold('W'), () => {
      globalThis.stage.y += 10 / globalThis.stage.scale.x;
      return false;
    });

    this.cameraHandler.reg(keyHold('A'), () => {
      globalThis.stage.x += 10 / globalThis.stage.scale.x;
      return false;
    });

    this.cameraHandler.reg(keyHold('S'), () => {
      globalThis.stage.y -= 10 / globalThis.stage.scale.x;
      return false;
    });

    this.cameraHandler.reg(keyHold('D'), () => {
      globalThis.stage.x -= 10 / globalThis.stage.scale.x;
      return false;
    });
  }

  private pan() {
    if (this.panLock) return;

    const props = this.getPanProperties();

    if (props.canvasWidth - props.camera2d.pointerX < 20) {
      const offset = props.canvasWidth - props.camera2d.pointerX;
      const modifier = (20 - offset) / 20;
      globalThis.stage.x -= (modifier * 10) / globalThis.stage.scale.x;
    }

    if (props.camera2d.pointerX < 20) {
      const modifier = (20 - props.camera2d.pointerX) / 20;
      globalThis.stage.x += (modifier * 10) / globalThis.stage.scale.x;
    }

    if (props.canvasHeight - props.camera2d.pointerY < 20) {
      const offset = props.canvasHeight - props.camera2d.pointerY;
      const modifier = (20 - offset) / 20;
      globalThis.stage.y -= (modifier * 10) / globalThis.stage.scale.y;
    }

    if (props.camera2d.pointerY < 20) {
      const modifier = (20 - props.camera2d.pointerY) / 20;
      globalThis.stage.y += (modifier * 10) / globalThis.stage.scale.y;
    }
  }

  // todo center view, handle the box, handle resize etc...
  private follow() {
    /*
    const selected = this.store.getSelected();
    if (
      this.followCam &&
      selected &&
      selected.getType() === Symbol.for('Wagon')
    ) {
      const wagon = selected as Wagon;
      this.specificController.setFollowCam(wagon.getRay().coord);
    }
    */
  }

  private getPanProperties(): TickInputProps {
    return {
      canvasWidth: (document.getElementById(
        'renderCanvasInner'
      ) as HTMLCanvasElement).width,
      canvasHeight: (document.getElementById(
        'renderCanvasInner'
      ) as HTMLCanvasElement).height,
      setFollowCamOff: this.followCam
        ? () => {
            this.followCam = false;
          }
        : () => {},
      camera2d: this.pixiController.getProps()
    };
  }
}
