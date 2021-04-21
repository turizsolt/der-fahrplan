import * as BABYLON from 'babylonjs';
import { InputHandler } from './InputHandler';
import { CreateTrackInputHandler } from './CreateTrackInputHandler';
import { BabylonVector3ToCoordinate } from '../../ui/babylon/converters/BabylonVector3ToCoordinate';
import { Ray } from '../../structs/Geometry/Ray';
import {
  snapXZ,
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
import { CameraInputHandler } from './CameraInputHandler';
import { SelectInputHandler } from './SelectInputHandler';
import { CreatePlatformInputHandler } from './CreatePlatformInputHandler';
import { CreateEngineInputHandler } from './CreateEngineInputHandler';
import { Store } from '../../structs/Interfaces/Store';
import { CreateStationInputHandler } from './CreateStationInputHandler';
import { Wagon } from '../../structs/Interfaces/Wagon';
import { BaseStorable } from '../../structs/Interfaces/BaseStorable';
import { Vector3 } from 'babylonjs';
import { VueSidebar } from './VueSidebar';
import { VueBigscreen } from './VueBigScreen';
import { VueToolbox } from './VueToolbox';
import { Trip } from '../../structs/Scheduling/Trip';
import { TickInputProps } from './TickInputProps';
import { VueViewbox } from './VueViewbox';
import { VueTestPanel } from './VueTestPanel';
import { Train } from '../../modules/Train/Train';
import { SpeedPedal } from '../../modules/Train/SpeedPedal';
import { CommandCreator } from '../../structs/Actuals/Store/Command/CommandCreator';
import { GENERATE_ID } from '../../structs/Actuals/Store/Command/CommandLog';
import { CreateSignalInputHandler } from './CreateSignalInputHandler';
import { Signal } from '../../modules/Signaling/Signal';
import { SignalSignal } from '../../modules/Signaling/SignalSignal';
import { CreateBlockJointInputHandler } from './CreateBlockJointInputHandler';
import { Block } from '../../modules/Signaling/Block';

export enum InputMode {
  CAMERA = 'CAMERA',
  SELECT = 'SELECT',
  CREATE_TRACK = 'CREATE_TRACK',
  CREATE_PLATFORM = 'CREATE_PLATFORM',
  CREATE_ENGINE = 'CREATE_ENGINE',
  CREATE_STATION = 'CREATE_STATION',
  CREATE_SIGNAL = 'CREATE_SIGNAL',
  CREATE_BLOCK_JOINT = 'CREATE_BLOCK_JOINT'
}

export class InputController {
  private mode: InputMode = InputMode.CAMERA;
  private viewMode: string = 'terrain';
  private store: Store;

  private inputHandler: InputHandler;
  private inputHandlers: Record<InputMode, InputHandler>;

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

  constructor(
    private scene: BABYLON.Scene,
    private camera: BABYLON.ArcRotateCamera,
  ) {
    this.store = productionContainer.get<() => Store>(TYPES.FactoryOfStore)();
    this.vueSidebar = new VueSidebar(this.store);
    this.vueBigScreen = new VueBigscreen(this.store);
    this.vueToolbox = new VueToolbox(this);
    this.vueViewbox = new VueViewbox(this);

    this.vueTestPanel = new VueTestPanel(this.store);
    this.store.getCommandLog().setInputController(this);

    this.inputHandlers = {
      [InputMode.CAMERA]: new CameraInputHandler(camera),
      [InputMode.SELECT]: new SelectInputHandler(),
      [InputMode.CREATE_TRACK]: new CreateTrackInputHandler(this.store),
      [InputMode.CREATE_PLATFORM]: new CreatePlatformInputHandler(),
      [InputMode.CREATE_ENGINE]: new CreateEngineInputHandler(),
      [InputMode.CREATE_STATION]: new CreateStationInputHandler(),
      [InputMode.CREATE_SIGNAL]: new CreateSignalInputHandler(),
      [InputMode.CREATE_BLOCK_JOINT]: new CreateBlockJointInputHandler(),
    };

    const modeNames = {
      [InputMode.CAMERA]: 'Cam',
      [InputMode.SELECT]: 'Sel',
      [InputMode.CREATE_TRACK]: '+Trac',
      [InputMode.CREATE_PLATFORM]: '+Plat',
      [InputMode.CREATE_ENGINE]: '+Eng',
      [InputMode.CREATE_STATION]: '+Stat',
      [InputMode.CREATE_SIGNAL]: '+Sign',
      [InputMode.CREATE_BLOCK_JOINT]: '+BJnt',
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
    const { pickedPoint, pickedMesh } = this.scene.pick(
      this.scene.pointerX,
      this.scene.pointerY
    );

    if (!pickedPoint) {
      const ret: InputProps = {
        point: null,
        mesh: pickedMesh,
        snappedPoint: null,
        snappedPositionOnTrack: null,
        snappedJoint: null,
        snappedJointOnTrack: null,
        wheelDeg: this.wheelRotation,
        wheelRad: (this.wheelRotation / 180) * Math.PI,
        selected: this.store.getSelected(),
        cameraRadius: this.camera.radius,
        cameraAlpha: this.camera.alpha,
        cameraBeta: this.camera.beta,
        pointerX: this.scene.pointerX,
        pointerY: this.scene.pointerY,
        targetX: this.camera.target.x,
        targetZ: this.camera.target.z,
        fromX: this.camera.position.x,
        fromY: this.camera.position.y,
        fromZ: this.camera.position.z,
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
      point: point,
      mesh: pickedMesh,
      snappedPoint: snapXZ(point),
      snappedPositionOnTrack: snapPositionOnTrack(point, trackList),
      snappedJoint: snapJoint(point, jointList),
      snappedJointOnTrack: snapPositionOnTrack(snapXZ(point), trackList),
      wheelDeg: this.wheelRotation,
      wheelRad: (this.wheelRotation / 180) * Math.PI,
      selected: this.store.getSelected(),
      cameraRadius: this.camera.radius,
      cameraAlpha: this.camera.alpha,
      cameraBeta: this.camera.beta,
      pointerX: this.scene.pointerX,
      pointerY: this.scene.pointerY,
      targetX: this.camera.target.x,
      targetZ: this.camera.target.z,
      fromX: this.camera.position.x,
      fromY: this.camera.position.y,
      fromZ: this.camera.position.z,
      wagonType: this.vueToolbox.getWagon()
    };
    ret.snappedPoint.dirXZ = ret.wheelRad;

    return ret;
  }

  down(event: PointerEvent) {
    const props = this.convert(event);
    this.downProps = props;
    this.inputHandler.down(props, event);
    this.downAt = (new Date()).getTime();
  }

  move(event: PointerEvent) {
    const now = (new Date()).getTime();
    if (now - this.downAt < 500) return;

    const props = this.convert(event);
    if (this.downProps) {
      this.inputHandler.move(this.downProps, props, event);
    } else {
      this.inputHandler.roam(props, event);
    }
  }

  up(event: PointerEvent) {
    if (!this.downProps) return;

    let props = this.convert(event);
    const now = (new Date()).getTime();

    if (
      //this.downProps.point && (
      now - this.downAt < 500
      // ||
      //(props.point &&
      //  this.downProps.point.coord.equalsTo(props.point.coord)))
    ) {
      let ready = this.selectIfPossible(event);
      if (ready) {
        this.inputHandler.cancel();
      } else {
        this.inputHandler.click(this.downProps, event);
      }
    } else {
      this.inputHandler.up(this.downProps, props, event);
    }
    this.downProps = null;
  }

  private wheelRotation = 0;

  private selectCallback: (ob: Object) => void = null;

  private selectIfPossible(event: PointerEvent) {
    let ready = false;
    if (this.downProps.mesh) {
      let meshId = this.downProps.mesh.id;
      if (meshId.includes('.')) {
        meshId = meshId.slice(0, meshId.indexOf('.'));
      }
      if (meshId.startsWith('clickable-')) {
        const [_, type, id, command] = meshId.split('-');
        const storedObj = this.store.get(id);
        const storedBrick = storedObj as BaseBrick;
        if (storedBrick) {
          if (command) {
            storedBrick.getRenderer().process(command);
            if(command === 'endA') {
                const wagon = storedBrick as Wagon;
                this.store.getCommandLog().addAction(CommandCreator.unmergeTrain(
                    wagon.getTrain().getId(),
                    GENERATE_ID,
                    wagon.getId(),
                ));
            }
          } else if (event.button === 2) {
            if (
                storedBrick.getType() === TYPES.TrackSwitch
              ) {
                this.store.getCommandLog().addAction(CommandCreator.switchTrack(storedBrick.getId()));
            } else if (
                storedBrick.getType() === TYPES.Signal
              ) {
                const signal = (storedBrick as Signal);
                signal.setSignal(signal.getSignal() === SignalSignal.Red ? SignalSignal.Green : SignalSignal.Red);
            }
          } else {
            let selected: BaseStorable = this.store.getSelected();
            if (storedObj.isSelected()) {
              if (
                this.selectCallback &&
                selected.getType() === TYPES.Wagon
              ) {
                (selected as Wagon).off('info', this.selectCallback);
              }

              this.store.clearSelected();
              this.vueSidebar.setData('selected', null);
              this.vueSidebar.setData('type', null);
              this.vueSidebar.setData('opts', []);
              storedObj.deselect();
            } else {
              if(this.store.getSelected()){
                  this.store.getSelected().deselect();
              }
              // todo temp
              console.log(storedBrick.getId());
              if(storedBrick.getType() === TYPES.Block) {
                const block = storedBrick as Block;
                const p = block.persist() as any;
                console.log(block.getId(), p.endA, p.endB);
              }
              this.select(storedBrick);
            }
          }
          ready = true;
        }
      }
    }
    return ready;
  }

  getSelected(): BaseStorable {
    return this.store.getSelected();
  }

  getSelectedBrick(): BaseBrick {
    return this.store.getSelected() as BaseBrick;
  }

  select(storedObj: BaseBrick) {
    if (this.getSelected()) {
      if (
        this.selectCallback &&
        this.getSelected().getType() === Symbol.for('Wagon')
      ) {
        (this.getSelected() as Wagon).off('info', this.selectCallback);
      }
    }

    storedObj.select();

    if (storedObj.getType() === Symbol.for('Wagon')) {
      this.selectCallback = (obj: Object): void => {
        this.vueSidebar.setData('selected', obj);
      };
      (this.getSelected() as Wagon).on('info', this.selectCallback);
    }
    this.vueSidebar.setData('selected', Object.freeze(storedObj.persistDeep()));
    this.vueSidebar.setData(
      'type',
      storedObj.getType() === Symbol.for('Passenger') ? 'passenger' : storedObj.getType() === Symbol.for('Wagon') ? 'wagon' : (storedObj.getType() === Symbol.for('Station') ? 'station' : 'idtext')
    );
    if (storedObj.getType() === Symbol.for('Wagon')) {
      this.vueSidebar.setData(
        'opts',
        this.store
          .getAllOf<Trip>(TYPES.Trip)
          .map(x => Object.freeze(x.persistDeep()))
          .sort((a: any, b: any) => a.departureTime - b.departureTime)
      );
    }
  }

  wheel(event: WheelEvent) {
    if (Math.sign(event.deltaY) > 0) {
      this.camera.radius *= 1.2;
    } else {
      this.camera.radius /= 1.2;
    }
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

      // copied from
      if (this.getSelectedBrick() && this.getSelectedBrick().getType() === Symbol.for('Wagon')) {
        this.vueSidebar.setData(
          'opts',
          this.store
            .getAllOf<Trip>(TYPES.Trip)
            .map(x => Object.freeze(x.persistDeep()))
            .sort((a: any, b: any) => a.departureTime - b.departureTime)
        );
      }
    }

    if (mode === 'builder') {
      this.vueToolbox.setShow(true);
    } else {
      this.vueToolbox.setShow(false);
    }
  }

  keyDown(key: string, mods: { shift: boolean; ctrl: boolean }): void {
    switch (key) {
      case 'X':
        this.wheelRotation += 45;
        if (this.wheelRotation > 180) this.wheelRotation -= 360;
        const props = this.convert(null);
        if (props.point) this.move(null);
        break;

      case 'ScrollLock':
        this.inputHandlers.CAMERA.setPanLock();
        break;

      case 'PageUp':
        {
          const list = this.store.getAllOf<Train>(Symbol.for('Train'));
          const wagon = this.getSelectedBrick()?.getType() === Symbol.for('Wagon') ? (this.getSelectedBrick() as Wagon) : null;
          const pivot = wagon?.getTrain()?.getId();
          const index = pivot ? list.findIndex(x => x.getId() === pivot) : -1;
          const newIndex = (index + 1) % list.length;
          this.select(list[newIndex].getWagons()[0]);
        }
        break;

      case 'PageDown':
        {
          const list = this.store.getAllOf<Train>(Symbol.for('Train'));
          const wagon = this.getSelectedBrick()?.getType() === Symbol.for('Wagon') ? (this.getSelectedBrick() as Wagon) : null;
          const pivot = wagon?.getTrain()?.getId();
          const index = pivot ? list.findIndex(x => x.getId() === pivot) : -1;
          const newIndex = (index - 1) < 0 ? list.length + index - 1 : index - 1;
          this.select(list[newIndex].getWagons()[0]);
        }
        break;
    }

    if (!this.getSelected()) return;

    switch (key) {
      case 'ArrowUp':
        if (this.getSelected().getType() === TYPES.Wagon) {
            const train = ((this.getSelected() as Wagon).getTrain());
            this.store.getCommandLog().addAction(
                CommandCreator.pedalTrain(
                    train.getId(),
                    train.getSpeed().getPedal(),
                    SpeedPedal.Throttle
                )
            );
        }
        break;

      case 'ArrowDown':
      if (this.getSelected().getType() === TYPES.Wagon) {
        const train = ((this.getSelected() as Wagon).getTrain());
        this.store.getCommandLog().addAction(
            CommandCreator.pedalTrain(
                train.getId(),
                train.getSpeed().getPedal(),
                SpeedPedal.Brake
            )
        );
    }
        break;
  
    }
  }

  keyUp(key: string, mods: { shift: boolean; ctrl: boolean }): void {
    switch (key) {
      case 'T':
        this.store.getCommandLog().runNext();
        break;

      case 'U':
        this.selectMode(InputMode.CAMERA);
        break;

      case 'I':
        this.selectMode(InputMode.SELECT);
        break;

      case 'O':
        this.selectMode(InputMode.CREATE_TRACK);
        break;

      case 'P':
        this.selectMode(InputMode.CREATE_PLATFORM);
        break;

      case '8':
        this.selectMode(InputMode.CREATE_ENGINE);
        break;

      case '9':
        this.selectMode(InputMode.CREATE_STATION);
        break;

      case 'K':
        const download = (content, fileName, contentType) => {
          var a = document.createElement('a');
          var file = new Blob([content], { type: contentType });
          a.href = URL.createObjectURL(file);
          a.download = fileName;
          a.click();
        };

        const data = {
          data: this.store.persistAll(),
          camera: this.saveCamera(),
          _version: 2,
          _format: 'fahrplan'
        };

        const fileName = `${new Date().toISOString()}.${(Math.random() *
          90000) |
          (0 + 100000)}.fahrplan`;

        download(JSON.stringify(data), fileName, 'application/json');
        break;

      case ' ':
        if (this.store.getTickSpeed() === 0) {
          this.store.setTickSpeed(1);
        } else {
          this.store.setTickSpeed(0);
        }
        break;


      case '`':
      case '0':
        this.store.setTickSpeed(0);
        break;

      case '1':
        this.store.setTickSpeed(1);
        break;

      case '2':
        this.store.setTickSpeed(2);
        break;

      case '3':
        this.store.setTickSpeed(3);
        break;

      case '4':
        this.store.setTickSpeed(4);
        break;

      case '5':
        this.store.setTickSpeed(5);
        break;
    }

    if (!this.getSelected()) return;

    switch (key) {
      case 'ArrowLeft':
      case 'ArrowRight':
        if (this.getSelected().getType() === TYPES.Wagon) {
            const wagon = this.getSelected() as Wagon;
            this.store.getCommandLog().addAction(CommandCreator.reverseTrain(
                wagon.getTrain().getId(),
            ));
        }
        break;

      case 'ArrowUp':
      case 'ArrowDown':
        if (this.getSelected().getType() === TYPES.Wagon) {
            const train = ((this.getSelected() as Wagon).getTrain());
            this.store.getCommandLog().addAction(
                CommandCreator.pedalTrain(
                    train.getId(),
                    train.getSpeed().getPedal(),
                    SpeedPedal.Neutral
                )
            );
        }
        break;


      case 'Z':
      if (this.getSelected().getType() === TYPES.Wagon) {
        const wagon = this.getSelected() as Wagon;
        this.store.getCommandLog().addAction(CommandCreator.reverseWagonFacing(
          wagon.getId(),
        ));
      }
        break;

      case 'M':
      if (this.getSelected().getType() === TYPES.Wagon) {
        const wagon = this.getSelected() as Wagon;
        const isShunting = wagon.getTrain().getSpeed().isShunting();
        this.store.getCommandLog().addAction(
          isShunting ?
            CommandCreator.unshuntingTrain(
              wagon.getTrain().getId(),
            ) :
            CommandCreator.shuntingTrain(
              wagon.getTrain().getId(),
            )
        );
        wagon.getTrain().getWagons().map(wagon => wagon.update());
      }
        break;

        case 'A':
          if (this.getSelected().getType() === TYPES.Wagon) {
            const wagon = this.getSelected() as Wagon;
            wagon.getTrain().setAutoMode(!wagon.getTrain().getAutoMode());
          }
        break;

      case '/':
        this.getSelectedBrick()
          .getRenderer()
          .process('detach');
        break;

      case 'Delete':
        this.getSelectedBrick()
          .getRenderer()
          .process('delete');
        break;

      case 'Enter':
        this.getSelectedBrick()
          .getRenderer()
          .process('stop');
        break;

      case 'S':
        this.store.getCommandLog().addAction(CommandCreator.switchTrack(this.getSelectedBrick().getId()));
        break;

      case 'Home':
        this.followCam = !this.followCam;
        break;
    }
  }

  keyHold(key: string, mods: { shift: boolean; ctrl: boolean }): void {
    if (!this.getSelected()) return;

    switch (key) {
      case 'C':
        this.getSelectedBrick()
          .getRenderer()
          .process('shuntForward');
        break;

      case 'V':
        this.getSelectedBrick()
          .getRenderer()
          .process('backward');
        break;

      case 'B':
        this.getSelectedBrick()
          .getRenderer()
          .process('shuntBackward');
        break;
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
    this.vueSidebar.setData('fps', this.camera.getEngine().getFps().toFixed());
    const passengerStats = this.store.getPassengerStats();
    this.vueSidebar.setData('passengerCount', passengerStats.count);
    this.vueSidebar.setData('passengerArrivedCount', passengerStats.arrivedCount);
    this.vueSidebar.setData('passengerAverageArriveSpeed', Math.round(passengerStats.averageArriveSpeed * 100) / 100);

    if (passengerStats.arrivedCount >= this.targetPassengerCount) {
      alert('Nyertél! Elvittél ' + this.targetPassengerCount + ' utast.');
      this.targetPassengerCount = 9999999;
    }

    if (this.inputHandler.tick) {
      const ize: TickInputProps = {
        pointerX: this.scene.pointerX,
        pointerY: this.scene.pointerY,
        canvasWidth: (document.getElementById('renderCanvas') as HTMLCanvasElement).width,
        canvasHeight: (document.getElementById('renderCanvas') as HTMLCanvasElement).height,
        targetX: this.camera.target.x,
        targetZ: this.camera.target.z,
        fromX: this.camera.position.x,
        fromY: this.camera.position.y,
        fromZ: this.camera.position.z,
        setFollowCamOff: this.followCam ? () => { this.followCam = false; } : () => { }
      }
      this.inputHandler.tick(ize);
    }

    if (this.followCam && this.getSelectedBrick() && this.getSelectedBrick().getType() === Symbol.for('Wagon')) {
      const wagon = this.getSelectedBrick() as Wagon;
      const dx = wagon.getRay().coord.x - this.camera.target.x;
      const dz = wagon.getRay().coord.z - this.camera.target.z;

      this.camera.setPosition(
        new Vector3(
          this.camera.position.x + dx,
          this.camera.position.y,
          this.camera.position.z + dz
        )
      );
      this.camera.setTarget(
        new Vector3(this.camera.target.x + dx, 0, this.camera.target.z + dz)
      );
    }
  }

  load(data: any) {
    this.store.loadAll(data);
  }

  saveCamera(): any {
    return {
      alpha: this.camera.alpha,
      beta: this.camera.beta,
      radius: this.camera.radius,
      target: {
        x: this.camera.target.x,
        y: this.camera.target.y,
        z: this.camera.target.z
      },
      position: {
        x: this.camera.position.x,
        y: this.camera.position.y,
        z: this.camera.position.z
      }
    };
  }

  setCamera(camera: any) {
    this.camera.alpha = camera.alpha;
    this.camera.beta = camera.beta;
    this.camera.radius = camera.radius;
    this.camera.setTarget(
      new Vector3(camera.target.x, camera.target.y, camera.target.z)
    );
    this.camera.setPosition(
      new Vector3(camera.position.x, camera.position.y, camera.position.z)
    );
  }
}
