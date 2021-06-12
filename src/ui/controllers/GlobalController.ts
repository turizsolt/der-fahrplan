import { InputHandler } from './InputHandler';
import { BabylonVector3ToCoordinate } from '../babylon/converters/BabylonVector3ToCoordinate';
import { Ray } from '../../structs/Geometry/Ray';
import {
  snapHexaXZ,
  snapPositionOnTrack,
  snapJoint
} from '../../structs/Geometry/Snap';
import { productionContainer } from '../../di/production.config';
import { TYPES } from '../../di/TYPES';
import { ActualTrack } from '../../modules/Track/ActualTrack';
import { TrackBase } from '../../modules/Track/TrackBase';
import { TrackJoint } from '../../modules/Track/TrackJoint/TrackJoint';
import { ActualTrackJoint } from '../../modules/Track/TrackJoint/ActualTrackJoint';
import { InputProps } from './InputProps';
import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { ActualTrackSwitch } from '../../modules/Track/ActualTrackSwitch';
import { Store } from '../../structs/Interfaces/Store';
import { Wagon } from '../../structs/Interfaces/Wagon';
import { BaseStorable } from '../../structs/Interfaces/BaseStorable';
import { VueSidebar } from './VueSidebar';
import { VueBigscreen } from './VueBigScreen';
import { VueToolbox } from './VueToolbox';
import { TickInputProps } from './TickInputProps';
import { VueViewbox } from './VueViewbox';
import { VueTestPanel } from './VueTestPanel';
import { Train } from '../../modules/Train/Train';
import { SpeedPedal } from '../../modules/Train/SpeedPedal';
import { CommandCreator } from '../../structs/Actuals/Store/Command/CommandCreator';
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
import { Input } from './InputHandlers/Interfaces/Input';
import { InputType } from './InputHandlers/Interfaces/InputType';
import { InputMod } from './InputHandlers/Interfaces/InputMod';
import { ChainedInputHandler } from './InputHandlers/ChainedInputHandler';
import { InputHandlerProp } from './InputHandlers/Interfaces/InputHandlerProp';

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
  private store: Store;

  private inputHandler: InputHandler;
  private inputHandlers: Record<any, InputHandler>;

  private downProps: InputProps;

  private mouseButtons: boolean[] = [];

  private vueToolbox: VueToolbox;
  private vueViewbox: VueViewbox;
  private vueBigScreen: VueBigscreen;
  private vueSidebar: VueSidebar;
  private vueTestPanel: VueTestPanel;

  private followCam: boolean = false;
  private timeLimit: number = 12;
  private originalTimeLimit: number = 12;
  private shortTimeLimit: number = 6;

  private targetPassengerCount: number = 9999999;

  private downAt: number = 0;

  private ih: NewInputHandler;

  constructor(private specificController: GUISpecificController) {
    this.store = productionContainer.get<() => Store>(TYPES.FactoryOfStore)();
    this.vueSidebar = new VueSidebar(this.store);
    this.vueBigScreen = new VueBigscreen(this.store);
    this.vueToolbox = new VueToolbox(this);
    this.vueViewbox = new VueViewbox(this);

    this.ih = new ChainedInputHandler(this.store, this.vueSidebar, this);

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

    this.downProps = null;
  }

  setTargetPassenger(count: number): void {
    this.targetPassengerCount = count;
  }

  convert(event: PointerEvent): InputProps {
    const { pickedPoint, pickedMesh } = this.specificController.pick(event);

    if (!pickedPoint) {
      const ret: InputProps = {
        point: null,
        mesh: pickedMesh,
        snappedPoint: null,
        snappedPositionOnTrack: null,
        snappedJoint: null,
        snappedJointOnTrack: null,
        // wheelDeg: this.wheelRotation,
        wheelRad: (this.wheelRotation / 180) * Math.PI,
        // selected: this.store.getSelected(),
        wagonType: this.vueToolbox.getWagon()
      };

      return ret;
    }

    const point: Ray = new Ray(BabylonVector3ToCoordinate(pickedPoint), 0);
    const list = this.store.getAll();
    const trackList: TrackBase[] = [];
    const jointList: TrackJoint[] = [];
    for (let elem of Object.keys(list)) {
      if (
        list[elem].constructor.name === ActualTrack.name ||
        list[elem].constructor.name === ActualTrackSwitch.name
      ) {
        trackList.push(list[elem] as TrackBase);
      }
      if (list[elem].constructor.name === ActualTrackJoint.name) {
        jointList.push(list[elem] as TrackJoint);
      }
    }

    const ret: InputProps = {
      // pick
      point: point, // only at Platform, deciding the side
      mesh: pickedMesh, // to actually get the selected

      // snap - 6 different uses it, should place inside them
      snappedPoint: snapHexaXZ(point),
      snappedPositionOnTrack: snapPositionOnTrack(point, trackList),
      snappedJoint: snapJoint(point, jointList),
      snappedJointOnTrack: snapPositionOnTrack(snapHexaXZ(point), trackList),

      // wheel, only for track placement
      // wheelDeg: this.wheelRotation, // nobody uses this
      wheelRad: (this.wheelRotation / 180) * Math.PI, // Track

      // nobody uses this
      // selected: this.store.getSelected(),

      // only for wagon placement
      wagonType: this.vueToolbox.getWagon() //Wagon
    };
    ret.snappedPoint.dirXZ = ret.wheelRad;

    return ret;
  }

  down(event: PointerEvent) {
    const props = this.convert(event);
    this.downProps = props;
    // this.inputHandler.down(props, event);
    this.ih.handle(
      {
        input: Input.MouseDown,
        type:
          event.button === 0
            ? InputType.MouseLeft
            : event.button === 2
            ? InputType.MouseRight
            : InputType.MouseMiddle,
        mod: InputMod.None
      },
      props
    );

    this.downAt = new Date().getTime();
  }

  move(event: PointerEvent) {
    const now = new Date().getTime();
    if (now - this.downAt < 500) return;

    const props = this.convert(event);
    if (this.downProps) {
      // this.inputHandler.move(this.downProps, props, event);
      this.ih.handle(
        {
          input: Input.MouseMove,
          type:
            event.button === 0
              ? InputType.MouseLeft
              : event.button === 2
              ? InputType.MouseRight
              : InputType.MouseMiddle,
          mod: InputMod.None
        },
        { ...props, downProps: this.downProps }
      );
    } else {
      // this.inputHandler.roam(props, event);
      this.ih.handle(
        {
          input: Input.MouseRoam,
          type:
            event.button === 0
              ? InputType.MouseLeft
              : event.button === 2
              ? InputType.MouseRight
              : InputType.MouseMiddle,
          mod: InputMod.None
        },
        props
      );
    }
  }

  up(event: PointerEvent) {
    if (!this.downProps) return;

    let props = this.convert(event);
    const now = new Date().getTime();

    if (
      //this.downProps.point && (
      now - this.downAt <
      500
      // ||
      //(props.point &&
      //  this.downProps.point.coord.equalsTo(props.point.coord)))
    ) {
      // let ready = (this.mode === InputMode.CREATE_BLOCK || this.mode === InputMode.ALLOW_PATH || this.mode === InputMode.CREATE_PATH || this.mode === InputMode.CREATE_SECTION) ? false : this.selectIfPossible(event);
      // if (ready) {
      // this.inputHandler.cancel();
      //} else {
      // this.inputHandler.click(this.downProps, event);
      this.ih.handle(
        {
          input: Input.MouseClick,
          type:
            event.button === 0
              ? InputType.MouseLeft
              : event.button === 2
              ? InputType.MouseRight
              : InputType.MouseMiddle,
          mod: InputMod.None
        },
        { ...props, downProps: this.downProps }
      );
      //}
    } else {
      // this.inputHandler.up(this.downProps, props, event);
      this.ih.handle(
        {
          input: Input.MouseUp,
          type:
            event.button === 0
              ? InputType.MouseLeft
              : event.button === 2
              ? InputType.MouseRight
              : InputType.MouseMiddle,
          mod: InputMod.None
        },
        { ...props, downProps: this.downProps }
      );
    }
    this.downProps = null;
  }

  private wheelRotation = 0;

  wheel(event: WheelEvent) {
    this.ih.handle({
      input: Input.Wheel,
      type:
        Math.sign(event.deltaY) > 0 ? InputType.WheelPos : InputType.WheelNeg,
      mod: InputMod.None
    });
  }

  selectMode(mode: InputMode) {
    this.inputHandler.cancel();
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

  // keyboard handling

  keyDown(key: string, mods: { shift: boolean; ctrl: boolean }): void {
    this.ih.handle(this.getHandle(Input.KeyboardDown, key, mods));
  }

  keyUp(key: string, mods: { shift: boolean; ctrl: boolean }): void {
    this.ih.handle(this.getHandle(Input.KeyboardUp, key, mods));
  }

  keyHold(key: string, mods: { shift: boolean; ctrl: boolean }): void {
    this.ih.handle(this.getHandle(Input.KeyboardHold, key, mods));
  }

  private getHandle(
    input: Input,
    key: string,
    mods: { shift: boolean; ctrl: boolean }
  ): InputHandlerProp {
    return {
      input: input,
      type: key,
      mod: this.getMods(mods)
    };
  }

  private getMods(mods: { shift: boolean; ctrl: boolean }): InputMod {
    return mods.shift
      ? mods.ctrl
        ? InputMod.Both
        : InputMod.Shift
      : mods.ctrl
      ? InputMod.Ctrl
      : InputMod.None;
  }

  // end of keyboard handling

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

    if (this.inputHandler.tick) {
      const ize: TickInputProps = {
        canvasWidth: (document.getElementById(
          'renderCanvas'
        ) as HTMLCanvasElement).width,
        canvasHeight: (document.getElementById(
          'renderCanvas'
        ) as HTMLCanvasElement).height,
        setFollowCamOff: this.followCam
          ? () => {
              this.followCam = false;
            }
          : () => {}
      };
      this.inputHandler.tick(ize);
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
