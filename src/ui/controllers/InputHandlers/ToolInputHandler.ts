import { InputHandler } from './InputHandler';
import { InputMode } from './InputMode';
import { VueToolbox } from '../VueToolbox';
import { InputHandlerProp } from './Interfaces/InputHandlerProp';
import { InputProps } from '../InputProps';
import { TrackInputHandler } from './Track/TrackInputHandler';
import { Store } from '../../../structs/Interfaces/Store';
import { CreateEngineInputHandler } from './Engine/CreateEngineInputHandler';

export class ToolInputHandler extends InputHandler {
  private inputHandler: InputHandler;
  private inputHandlers: Record<any, InputHandler>;
  private mode: InputMode;

  constructor(private vueToolbox: VueToolbox, private store: Store) {
    super();

    this.inputHandlers = {
      [InputMode.CAMERA]: null,
      [InputMode.CREATE_TRACK]: new TrackInputHandler(store),
      [InputMode.CREATE_ENGINE]: new CreateEngineInputHandler(store)
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
