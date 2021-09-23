import { InputHandler } from '../InputHandler';
import { Store } from '../../../../structs/Interfaces/Store';
import { GUISpecificController } from '../../GUISpecificController';
import { CameraInputHandlerPlugin } from './CameraInputHandlerPlugin';
import { CameraInputHandlerBabylon } from './CameraInputHandlerBabylon';
import { CameraInputHandlerPixi } from './CameraInputHandlerPixi';

export class CameraInputHandler extends InputHandler {
  private plugin: CameraInputHandlerPlugin;

  constructor(store: Store, specificController: GUISpecificController) {
    super();

    if (globalThis.startParam === '2d') {
      this.plugin = new CameraInputHandlerPixi(store, specificController, this);
    } else {
      this.plugin = new CameraInputHandlerBabylon(
        store,
        specificController,
        this
      );
    }
    this.plugin.init();
  }
}
