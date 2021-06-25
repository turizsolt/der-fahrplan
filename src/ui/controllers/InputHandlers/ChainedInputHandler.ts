import { NewInputHandler } from './NewInputHandler';
import { Store } from '../../../structs/Interfaces/Store';
import { VueSidebar } from '../VueSidebar';
import { InputProps } from '../InputProps';
import { InputHandlerProp } from './Interfaces/InputHandlerProp';
import { NewSelectInputHandler } from './NewSelectInputHandler';
import { NewTrackInputHandler } from './NewTrackInputHandler';
import { GameSpeedInputHandler } from './GameSpeedInputHandler';
import { TrainInputHandler } from './TrainInputHandler';
import { GlobalController } from '../GlobalController';
import { GeneralInputHandler } from './GeneralInputHandler';
import { NewCameraInputHandler } from './NewCameraInputHandler';
import { GUISpecificController } from '../GUISpecificController';

export class ChainedInputHandler extends NewInputHandler {
  private handlers: NewInputHandler[] = [];

  constructor(
    store: Store,
    vueSidebar: VueSidebar,
    globalController: GlobalController,
    specificController: GUISpecificController
  ) {
    super();

    this.handlers.push(new NewSelectInputHandler(store, vueSidebar));
    this.handlers.push(new NewTrackInputHandler(store));
    this.handlers.push(new NewCameraInputHandler(store, specificController));
    this.handlers.push(new GameSpeedInputHandler(store));
    this.handlers.push(new TrainInputHandler(store));
    this.handlers.push(new GeneralInputHandler(store, globalController));
  }

  handle(inputProp: InputHandlerProp, legacyProp?: InputProps): boolean {
    for (const handler of this.handlers) {
      if (handler.handle(inputProp, legacyProp) !== false) return true;
    }
    return false;
  }
}
