import * as BABYLON from 'babylonjs';
import { NewInputHandler } from './NewInputHandler';
import { WheelNeg, WheelPos, MouseMiddle } from './Interfaces/InputType';
import { wheel, move, drag, tick, keyDown } from './Interfaces/Helpers';
import { Store } from '../../../structs/Interfaces/Store';
import { GUISpecificController } from '../GUISpecificController';
import { BabylonController } from '../BabylonController';
import { InputMod } from './Interfaces/InputMod';
import { Vector3 } from 'babylonjs';
import { TickInputProps } from '../TickInputProps';
import { Wagon } from '../../../structs/Interfaces/Wagon';

export class NewCameraInputHandler extends NewInputHandler {
  // todo babylon
  private camera: BABYLON.ArcRotateCamera;
  private babylonController: BabylonController;
  private cameraDownProps: any;
  private panLock: boolean = true;
  private followCam: boolean = false;

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
  }

  private pan() {
    if (this.panLock) return;

    const props: TickInputProps = {
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
        : () => {}
    };

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
}
