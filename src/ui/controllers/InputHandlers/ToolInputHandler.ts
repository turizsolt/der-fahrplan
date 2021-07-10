import { InputHandler } from './InputHandler';
import { InputMode } from './InputMode';
import { VueToolbox } from '../VueToolbox';
import { InputHandlerProp } from './Interfaces/InputHandlerProp';
import { InputProps } from '../InputProps';
import { TrackInputHandler } from './Track/TrackInputHandler';
import { Store } from '../../../structs/Interfaces/Store';
import { CreateEngineInputHandler } from './Engine/CreateEngineInputHandler';
import { CreatePlatformInputHandler } from './Platform/CreatePlatformInputHandler';
import { CreateStationInputHandler } from './Station/CreateStationInputHandler';
import { BlockJointInputHandler } from './BlockJoint/BlockJointInputHandler';
import { BlockWizardInputHandler } from './BlockWizard/BlockWizardInputHandler';
import { PathInputHandler } from './Path/PathInputHandler';

export class ToolInputHandler extends InputHandler {
  private inputHandler: InputHandler;
  private inputHandlers: Record<any, InputHandler>;
  private mode: InputMode;

  constructor(private vueToolbox: VueToolbox, private store: Store) {
    super();

    this.inputHandlers = {
      [InputMode.CAMERA]: null,
      [InputMode.CREATE_TRACK]: new TrackInputHandler(store),
      [InputMode.CREATE_ENGINE]: new CreateEngineInputHandler(store),
      [InputMode.CREATE_PLATFORM]: new CreatePlatformInputHandler(store),
      [InputMode.CREATE_STATION]: new CreateStationInputHandler(store),
      [InputMode.CREATE_BLOCK_JOINT]: new BlockJointInputHandler(store),
      [InputMode.BLOCK_WIZARD]: new BlockWizardInputHandler(store),
      [InputMode.CREATE_PATH]: new PathInputHandler(store)
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
      [InputMode.ALLOW_PATH]: 'Allow',
      [InputMode.BLOCK_WIZARD]: 'BWiz'
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
