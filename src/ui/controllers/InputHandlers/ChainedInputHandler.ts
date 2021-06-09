import { NewInputHandler } from './NewInputHandler';
import { Store } from '../../../structs/Interfaces/Store';
import { VueSidebar } from '../VueSidebar';
import { InputProps } from '../InputProps';
import { InputHandlerProp } from './Interfaces/InputHandlerProp';
import { NewSelectInputHandler } from './NewSelectInputHandler';
import { NewTrackInputHandler } from './NewTrackInputHandler';

export class ChainedInputHandler extends NewInputHandler {
  private handlers: NewInputHandler[] = [];

  constructor(private store: Store, private vueSidebar: VueSidebar) {
    super();

    this.handlers.push(new NewTrackInputHandler(store));
    this.handlers.push(new NewSelectInputHandler(store, vueSidebar));
  }

  handle(inputProp: InputHandlerProp, legacyProp?: InputProps): boolean {
    for (const handler of this.handlers) {
      if (handler.handle(inputProp, legacyProp) !== false) return true;
    }
    return false;
  }
}
