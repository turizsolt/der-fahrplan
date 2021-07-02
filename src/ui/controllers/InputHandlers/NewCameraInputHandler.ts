import { NewInputHandler } from './NewInputHandler';
import { Store } from '../../../structs/Interfaces/Store';
import { GUISpecificController } from '../GUISpecificController';
import { NewCameraInputHandlerPlugin } from './NewCameraInputHandlerPlugin';
import { NewCameraInputHandlerBabylon } from './NewCameraInputHandlerBabylon';
import { NewCameraInputHandlerPixi } from './NewCameraInputHandlerPixi';

export class NewCameraInputHandler extends NewInputHandler {
  private plugin: NewCameraInputHandlerPlugin;

  constructor(store: Store, specificController: GUISpecificController) {
    super();

    if (globalThis.startParam === '2d') {
      this.plugin = new NewCameraInputHandlerPixi(
        store,
        specificController,
        this
      );
    } else {
      this.plugin = new NewCameraInputHandlerBabylon(
        store,
        specificController,
        this
      );
    }
    this.plugin.init();
  }
}
