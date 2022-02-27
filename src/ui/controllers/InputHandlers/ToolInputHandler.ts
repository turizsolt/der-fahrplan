import { InputHandler } from './InputHandler';
import { InputMode } from './InputMode';
import { VueToolbox } from '../VueToolbox';
import { InputHandlerProp } from './Interfaces/InputHandlerProp';
import { TrackInputHandler } from './Track/TrackInputHandler';
import { Store } from '../../../structs/Interfaces/Store';
import { CreateEngineInputHandler } from './Engine/CreateEngineInputHandler';
import { CreatePlatformInputHandler } from './Platform/CreatePlatformInputHandler';
import { CreateWaitingHallInputHandler } from './WaitingHall/CreateWaitingHallInputHandler';
import { BlockJointInputHandler } from './BlockJoint/BlockJointInputHandler';
import { BlockWizardInputHandler } from './BlockWizard/BlockWizardInputHandler';
import { PathInputHandler } from './Path/PathInputHandler';
import { CapacityCapInputHandler } from './CapacityCap/CapacityCapInputHandler';
import { AssignStationInputHandler } from './AssignStation/AssignStationInputHandler';
import { PlatformGroupInputHandler } from './PlatformGroup/PlatformGroupInputHandler';
import { DeleteInputHandler } from './Delete/DeleteInputHandler';
import { PathToStationInputHandler } from './PathBlockToStation/PathBlockToStationInputHandler';

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
            [InputMode.CREATE_WAITING_HALL]: new CreateWaitingHallInputHandler(store),
            [InputMode.CREATE_BLOCK_JOINT]: new BlockJointInputHandler(store),
            [InputMode.BLOCK_WIZARD]: new BlockWizardInputHandler(store),
            [InputMode.ASSIGN_STATION]: new AssignStationInputHandler(store),
            [InputMode.ADD_PLATFORM_GROUP]: new PlatformGroupInputHandler(store),
            [InputMode.CREATE_PATH]: new PathInputHandler(store),
            [InputMode.PATHBLOCK_TO_STATION]: new PathToStationInputHandler(store),
            [InputMode.DELETE]: new DeleteInputHandler(store),
            [InputMode.CREATE_CAPACITY_CAP]: new CapacityCapInputHandler(store),
        };

        const modeNames: Record<InputMode, string> = {
            [InputMode.CAMERA]: 'Cam',
            [InputMode.SELECT]: 'Sel',
            [InputMode.CREATE_TRACK]: '+Trac',
            [InputMode.CREATE_PLATFORM]: '+Plat',
            [InputMode.CREATE_ENGINE]: '+Eng',
            [InputMode.CREATE_WAITING_HALL]: '+WH',
            [InputMode.CREATE_SIGNAL]: '+Sign',
            [InputMode.CREATE_BLOCK_JOINT]: '+BJnt',
            [InputMode.CREATE_BLOCK]: '+Blck',
            [InputMode.CREATE_SECTION]: '+Sect',
            [InputMode.CREATE_PATH]: '+Path',
            [InputMode.ASSIGN_STATION]: 'Stat',
            [InputMode.ADD_PLATFORM_GROUP]: 'PlGr',
            [InputMode.ALLOW_PATH]: 'Allow',
            [InputMode.PATHBLOCK_TO_STATION]: 'PB St',
            [InputMode.BLOCK_WIZARD]: 'BWiz',
            [InputMode.DELETE]: 'Del',
            [InputMode.CREATE_CAPACITY_CAP]: 'CCap'
        };

        for (let mode of Object.keys(this.inputHandlers)) {
            this.vueToolbox.addButton({ id: mode, text: modeNames[mode] });
        }

        this.selectMode(InputMode.CAMERA);
    }

    selectMode(mode: InputMode) {
        this.mode = mode;
        this.inputHandler = this.inputHandlers[this.mode];
        this.vueToolbox.setSelected(mode);
    }

    handle(inputProp: InputHandlerProp, legacyEvent?: PointerEvent): boolean {
        if (!this.inputHandler) return false;
        return this.inputHandler.handle(inputProp, legacyEvent);
    }
}
