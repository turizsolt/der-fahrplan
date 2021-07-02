import { NewInputHandler } from './NewInputHandler';
import { InputMode } from './InputMode';
import { VueToolbox } from '../VueToolbox';
import { InputHandlerProp } from './Interfaces/InputHandlerProp';
import { InputProps } from '../InputProps';
import { NewTrackInputHandler } from './NewTrackInputHandler';
import { Store } from '../../../structs/Interfaces/Store';

export class ToolInputHandler extends NewInputHandler {
  private inputHandler: NewInputHandler;
  private inputHandlers: Record<any, NewInputHandler>;
  private mode: InputMode;

  constructor(private vueToolbox: VueToolbox, private store: Store) {
    super();

    this.inputHandlers = {
      [InputMode.CAMERA]: null,
      [InputMode.CREATE_TRACK]: new NewTrackInputHandler(store)
    };

    const modeNames: Record<InputMode, string> = {
      [InputMode.CAMERA]: 'Cam',
      [InputMode.SELECT]: 'Sel',
      [InputMode.CREATE_TRACK]: '+Trac',
      [InputMode.CREATE_PLATFORM]: '+Plat',
      [InputMode.CREATE_ENGINE]: '+Eng',
      [InputMode.CREATE_STATION]: '+Stat',
      [InputMode.CREATE_SIGNAL]: '+Sign',
      [InputMode.CREATE_BLOCK_JOINT]: '+BJnt',
      [InputMode.CREATE_BLOCK]: '+Blck',
      [InputMode.CREATE_SECTION]: '+Sect',
      [InputMode.CREATE_PATH]: '+Path',
      [InputMode.ALLOW_PATH]: 'Allow'
    };

    for (let mode of Object.keys(this.inputHandlers)) {
      this.vueToolbox.addButton({ id: mode, text: modeNames[mode] });
    }

    this.selectMode(InputMode.CREATE_TRACK);
  }

  selectMode(mode: InputMode) {
    this.mode = mode;
    this.inputHandler = this.inputHandlers[this.mode];
    this.vueToolbox.setSelected(mode);
  }

  handle(inputProp: InputHandlerProp, legacyProp?: InputProps): boolean {
    if (!this.inputHandler) return false;
    return this.inputHandler.handle(inputProp, legacyProp);
  }
}
