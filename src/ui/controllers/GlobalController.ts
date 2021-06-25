import { InputHandler } from './InputHandler';
import { Store } from '../../structs/Interfaces/Store';
import { VueSidebar } from './VueSidebar';
import { VueBigscreen } from './VueBigScreen';
import { VueToolbox } from './VueToolbox';
import { VueViewbox } from './VueViewbox';
import { VueTestPanel } from './VueTestPanel';
/*
import { CreateTrackInputHandler } from './CreateTrackInputHandler';
import { CameraInputHandler } from './CameraInputHandler';
import { SelectInputHandler } from './SelectInputHandler';
import { CreatePlatformInputHandler } from './CreatePlatformInputHandler';
import { CreateEngineInputHandler } from './CreateEngineInputHandler';
import { CreateStationInputHandler } from './CreateStationInputHandler';
import { CreateSignalInputHandler } from './CreateSignalInputHandler';
import { CreateBlockJointInputHandler } from './CreateBlockJointInputHandler';
import { CreateBlockInputHandler } from './CreateBlockInputHandler';
import { AllowPathInputHandler } from './AllowPathInputHandler';
import { CreatePathInputHandler } from './CreatePathInputHandler';
import { CreateSectionInputHandler } from './CreateSectionInputHandler';
*/
import { GUISpecificController } from './GUISpecificController';
import { NewInputHandler } from './InputHandlers/NewInputHandler';
import { ChainedInputHandler } from './InputHandlers/ChainedInputHandler';
import { InputController } from './InputController';

export enum InputMode {
  CAMERA = 'CAMERA',
  SELECT = 'SELECT',
  CREATE_TRACK = 'CREATE_TRACK',
  CREATE_PLATFORM = 'CREATE_PLATFORM',
  CREATE_ENGINE = 'CREATE_ENGINE',
  CREATE_STATION = 'CREATE_STATION',
  CREATE_SIGNAL = 'CREATE_SIGNAL',
  CREATE_BLOCK_JOINT = 'CREATE_BLOCK_JOINT',
  CREATE_BLOCK = 'CREATE_BLOCK',
  CREATE_SECTION = 'CREATE_SECTION',
  CREATE_PATH = 'CREATE_PATH',
  ALLOW_PATH = 'ALLOW_PATH'
}

export class GlobalController {
  private mode: InputMode = InputMode.CAMERA;
  private viewMode: string = 'terrain';

  private inputHandler: InputHandler;
  private inputHandlers: Record<any, InputHandler>;

  private vueToolbox: VueToolbox;
  private vueViewbox: VueViewbox;
  private vueBigScreen: VueBigscreen;
  private vueSidebar: VueSidebar;
  private vueTestPanel: VueTestPanel;

  private targetPassengerCount: number = 9999999;

  private ih: NewInputHandler;
  private inputController: InputController;

  constructor(
    private store: Store,
    private specificController: GUISpecificController
  ) {
    this.vueSidebar = new VueSidebar(this.store);
    this.vueBigScreen = new VueBigscreen(this.store);
    this.vueToolbox = new VueToolbox(this);
    this.vueViewbox = new VueViewbox(this);

    this.ih = new ChainedInputHandler(
      this.store,
      this.vueSidebar,
      this,
      this.specificController
    );
    this.inputController = new InputController(
      this.store,
      this.ih,
      this.specificController
    );

    this.vueTestPanel = new VueTestPanel(this.store);
    this.store.getCommandLog().setInputController(this);

    this.inputHandlers = {
      /*
      [InputMode.CAMERA]: new CameraInputHandler(this.specificController),
      [InputMode.SELECT]: new SelectInputHandler(),
      [InputMode.CREATE_TRACK]: new CreateTrackInputHandler(this.store),
      [InputMode.CREATE_PLATFORM]: new CreatePlatformInputHandler(),
      [InputMode.CREATE_ENGINE]: new CreateEngineInputHandler(),
      [InputMode.CREATE_STATION]: new CreateStationInputHandler(),
      [InputMode.CREATE_SIGNAL]: new CreateSignalInputHandler(),
      [InputMode.CREATE_BLOCK_JOINT]: new CreateBlockJointInputHandler(),
      [InputMode.CREATE_BLOCK]: new CreateBlockInputHandler(),
      [InputMode.CREATE_SECTION]: new CreateSectionInputHandler(),
      [InputMode.CREATE_PATH]: new CreatePathInputHandler(),
      [InputMode.ALLOW_PATH]: new AllowPathInputHandler()
      */
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
    this.vueToolbox.setSelected(this.mode);

    this.inputHandler = this.inputHandlers[this.mode];

    this.vueViewbox.addButton({ id: 'terrain', text: 'Terrain' });
    this.vueViewbox.addButton({ id: 'schedule', text: 'Schedule' });
    this.vueViewbox.addButton({ id: 'builder', text: 'Builder' });
    this.vueViewbox.setSelected('terrain');
  }

  getInputController(): InputController {
    return this.inputController;
  }

  setTargetPassenger(count: number): void {
    this.targetPassengerCount = count;
  }

  selectMode(mode: InputMode) {
    // todo this.inputHandler.cancel();
    this.mode = mode;
    this.inputHandler = this.inputHandlers[this.mode];
    this.vueToolbox.setSelected(mode);
  }

  selectView(mode: string) {
    this.viewMode = mode;
    this.vueViewbox.setSelected(mode);

    if (mode === 'schedule') {
      this.selectMode(InputMode.SELECT);
      this.vueBigScreen.setShow(true);
    } else {
      this.selectMode(InputMode.CAMERA);
      this.vueBigScreen.setShow(false);
    }

    if (mode === 'builder') {
      this.vueToolbox.setShow(true);
    } else {
      this.vueToolbox.setShow(false);
    }
  }

  tick() {
    const speed = this.store.getTickSpeed();
    this.store.tick();
    const count = Math.floor(this.store.getTickCount() / 60);
    this.vueSidebar.setData(
      'tickCount',
      Math.floor(count / 60) + ':' + (count % 60 < 10 ? '0' : '') + (count % 60)
    );
    this.vueSidebar.setData('tickSpeed', speed);
    this.vueSidebar.setData('fps', this.specificController.getFps());
    const passengerStats = this.store.getPassengerStats();
    this.vueSidebar.setData('passengerCount', passengerStats.count);
    this.vueSidebar.setData(
      'passengerArrivedCount',
      passengerStats.arrivedCount
    );
    this.vueSidebar.setData(
      'passengerAverageArriveSpeed',
      Math.round(passengerStats.averageArriveSpeed * 100) / 100
    );

    if (passengerStats.arrivedCount >= this.targetPassengerCount) {
      alert('Nyertél! Elvittél ' + this.targetPassengerCount + ' utast.');
      this.targetPassengerCount = 9999999;
    }
  }

  load(data: any) {
    this.store.loadAll(data);
  }

  // specific

  saveSpecific(): any {
    return this.specificController.saveSpecific();
  }

  loadSpecific(obj: any): void {
    this.specificController.loadSpecific(obj);
  }
}
