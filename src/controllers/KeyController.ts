import * as BABYLON from 'babylonjs';
import { Engine } from '../structs/Engine/Engine';
import { Controller } from './Controller';

export class KeyController {
  private map: Record<string, boolean>;
  private scene: BABYLON.Scene;
  private controller: Controller;

  constructor() {}

  setScene(scene: BABYLON.Scene) {
    this.scene = scene;
  }

  setController(controller: Controller) {
    this.controller = controller;
  }

  handleKeys() {
    this.map = {};
    this.scene.actionManager = new BABYLON.ActionManager(this.scene);

    this.scene.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnKeyDownTrigger,
        evt => {
          this.map[evt.sourceEvent.key] = evt.sourceEvent.type == 'keydown';
        }
      )
    );

    this.scene.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnKeyUpTrigger,
        evt => {
          this.map[evt.sourceEvent.key] = evt.sourceEvent.type == 'keydown';
        }
      )
    );
  }

  private enabledD = true;
  private enabledQ = true;
  private enabledZ = true;
  private enabledX = true;
  private enabledC = true;
  private enabledV = true;

  handleKeyCommands(engine: Engine) {
    this.scene.registerAfterRender(() => {
      if (this.map['w'] || this.map['W']) {
        engine.forward();
      }

      if (this.map['s'] || this.map['S']) {
        engine.backward();
      }

      if (this.map['d'] || this.map['D']) {
        if (this.enabledD) {
          engine.stop();
          this.enabledD = false;
          setTimeout(() => {
            this.enabledD = true;
          }, 500);
        }
      }

      if (this.map['q'] || this.map['Q']) {
        if (this.enabledQ) {
          this.controller.nextViewMode();
          this.enabledQ = false;
          setTimeout(() => {
            this.enabledQ = true;
          }, 500);
        }
      }

      if (this.map['z'] || this.map['Z']) {
        if (this.enabledZ) {
          this.controller.changeRotation(-15);
          this.enabledZ = false;
          setTimeout(() => {
            this.enabledZ = true;
          }, 100);
        }
      }

      if (this.map['x'] || this.map['X']) {
        if (this.enabledX) {
          this.controller.changeRotation(+15);
          this.enabledX = false;
          setTimeout(() => {
            this.enabledX = true;
          }, 100);
        }
      }

      if (this.map['c'] || this.map['C']) {
        if (this.enabledC) {
          this.controller.changeRotation(-45);
          this.enabledC = false;
          setTimeout(() => {
            this.enabledC = true;
          }, 100);
        }
      }

      if (this.map['v'] || this.map['V']) {
        if (this.enabledV) {
          this.controller.changeRotation(+45);
          this.enabledV = false;
          setTimeout(() => {
            this.enabledV = true;
          }, 100);
        }
      }
    });
  }
}
