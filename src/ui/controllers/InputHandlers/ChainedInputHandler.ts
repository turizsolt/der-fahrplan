import { InputHandler } from './InputHandler';
import { Store } from '../../../structs/Interfaces/Store';
import { VueSidebar } from '../VueSidebar';
import { InputHandlerProp } from './Interfaces/InputHandlerProp';
import { SelectInputHandler } from './SelectInputHandler';
import { GameSpeedInputHandler } from './GameSpeedInputHandler';
import { TrainInputHandler } from './TrainInputHandler';
import { GlobalController } from '../GlobalController';
import { GeneralInputHandler } from './GeneralInputHandler';
import { CameraInputHandler } from './Camera/CameraInputHandler';
import { GUISpecificController } from '../GUISpecificController';
import { ToolInputHandler } from './ToolInputHandler';

export class ChainedInputHandler extends InputHandler {
  private handlers: InputHandler[] = [];

  constructor(
    store: Store,
    vueSidebar: VueSidebar,
    globalController: GlobalController,
    specificController: GUISpecificController,
    toolInputHandler: ToolInputHandler
  ) {
    super();

    this.handlers.push(toolInputHandler);
    this.handlers.push(new SelectInputHandler(store, vueSidebar));
    this.handlers.push(new CameraInputHandler(store, specificController));
    this.handlers.push(new GameSpeedInputHandler(store));
    this.handlers.push(new TrainInputHandler(store));
    this.handlers.push(new GeneralInputHandler(store, globalController));
  }

  handle(inputProp: InputHandlerProp, legacyEvent?: PointerEvent): boolean {
    for (const handler of this.handlers) {
      if (handler.handle(inputProp, legacyEvent) !== false) return true;
    }
    return false;
  }
}
