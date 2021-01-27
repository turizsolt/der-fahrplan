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
import { ActualTrack } from '../../structs/Actuals/Track/ActualTrack';
import { TrackBase } from '../../structs/Interfaces/TrackBase';
import { TrackJoint } from '../../structs/Interfaces/TrackJoint';
import { ActualTrackJoint } from '../../structs/Actuals/TrackJoint/ActualTrackJoint';
import { InputProps } from './InputProps';
import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { ActualTrackSwitch } from '../../structs/Actuals/Track/ActualTrackSwitch';
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
import { PassengerGenerator } from '../../structs/Actuals/PassengerGenerator';

export enum InputMode {
  CAMERA = 'CAMERA',
  SELECT = 'SELECT',
  CREATE_TRACK = 'CREATE_TRACK',
  CREATE_PLATFORM = 'CREATE_PLATFORM',
  CREATE_ENGINE = 'CREATE_ENGINE',
  CREATE_STATION = 'CREATE_STATION'
}

export class InputController {
  private mode: InputMode = InputMode.CAMERA;
  private store: Store;

  private inputHandler: InputHandler;
  private inputHandlers: Record<InputMode, InputHandler>;

  private downProps: InputProps;

  private mouseButtons: boolean[] = [];

  private vueToolbox: VueToolbox;
  private vueBigScreen: VueBigscreen;
  private vueSidebar: VueSidebar;

  private followCam: boolean = false;

  constructor(
    private scene: BABYLON.Scene,
    private camera: BABYLON.ArcRotateCamera,
    private passengerGenerator: PassengerGenerator
  ) {
    this.store = productionContainer.get<() => Store>(TYPES.FactoryOfStore)();
    this.vueSidebar = new VueSidebar(this.store);
    this.vueBigScreen = new VueBigscreen(this.store);
    this.vueToolbox = new VueToolbox(this.store, this);

    this.inputHandlers = {
      [InputMode.CAMERA]: new CameraInputHandler(camera),
      [InputMode.SELECT]: new SelectInputHandler(),
      [InputMode.CREATE_TRACK]: new CreateTrackInputHandler(),
      [InputMode.CREATE_PLATFORM]: new CreatePlatformInputHandler(),
      [InputMode.CREATE_ENGINE]: new CreateEngineInputHandler(),
      [InputMode.CREATE_STATION]: new CreateStationInputHandler()
    };

    const modeNames = {
      [InputMode.CAMERA]: 'Cam',
      [InputMode.SELECT]: 'Sel',
      [InputMode.CREATE_TRACK]: '+Trac',
      [InputMode.CREATE_PLATFORM]: '+Plat',
      [InputMode.CREATE_ENGINE]: '+Eng',
      [InputMode.CREATE_STATION]: '+Stat'
    };

    for (let mode of Object.keys(this.inputHandlers)) {
      this.vueToolbox.addButton({ id: mode, text: modeNames[mode] });
    }
    this.vueToolbox.setSelected(this.mode);

    this.inputHandler = this.inputHandlers[this.mode];

    this.downProps = null;
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
  }

  move(event: PointerEvent) {
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

    if (
      this.downProps.point &&
      props.point &&
      this.downProps.point.coord.equalsTo(props.point.coord)
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
      //   console.log(meshId);
      if (meshId.startsWith('clickable-')) {
        const [_, type, id, command] = meshId.split('-');
        const storedObj = this.store.get(id);
        const storedBrick = storedObj as BaseBrick;
        if (storedBrick) {
          if (command) {
            storedBrick.getRenderer().process(command);
          } else if (event.button === 2) {
            storedBrick.getRenderer().process('switch');
          } else {
            let selected: BaseStorable = this.store.getSelected();
            if (storedObj.isSelected()) {
              if (
                this.selectCallback &&
                selected.getType() === Symbol.for('Wagon')
              ) {
                (selected as Wagon).unsubscribeToUpdates(this.selectCallback);
              }

              this.store.clearSelected();
              this.vueSidebar.setData('selected', null);
              this.vueSidebar.setData('type', null);
              this.vueSidebar.setData('opts', []);
            } else {
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
        (this.getSelected() as Wagon).unsubscribeToUpdates(this.selectCallback);
      }
    }

    storedObj.select();

    if (storedObj.getType() === Symbol.for('Wagon')) {
      this.selectCallback = (obj: Object): void => {
        this.vueSidebar.setData('selected', obj);
      };
      (this.getSelected() as Wagon).subscribeToUpdates(this.selectCallback);
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
    }

    if (!this.getSelected()) return;

    switch (key) {

      case 'ArrowUp':
        this.getSelectedBrick()
          .getRenderer()
          .process('forward');
        break;

      case 'ArrowDown':
        this.getSelectedBrick()
          .getRenderer()
          .process('backward');
        break;
    }
  }

  keyUp(key: string, mods: { shift: boolean; ctrl: boolean }): void {
    switch (key) {
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

      case '7':
        this.vueBigScreen.toggleShow();
        break;

      case '8':
        this.selectMode(InputMode.CREATE_ENGINE);
        break;

      case '9':
        this.selectMode(InputMode.CREATE_STATION);
        break;

      case 'ArrowUp':
        this.upTime = 0;
        break;

      case 'ArrowDown':
        this.downTime = 0;
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
          _version: 1,
          _format: 'fahrplan'
        };

        const fileName = `${new Date().toISOString()}.${(Math.random() *
          90000) |
          (0 + 100000)}.fahrplan`;

        download(JSON.stringify(data), fileName, 'application/json');
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
      case 'ArrowRight':
        if (this.getSelected().getType() === TYPES.Wagon) {
          this.getSelectedBrick()
            .getRenderer()
            .process('swapSide');
        }
        break;

      case 'Z':
        this.getSelectedBrick()
          .getRenderer()
          .process('swapEnds');
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
        this.getSelectedBrick()
          .getRenderer()
          .process('switch');
        break;

      case 'Home':
        this.followCam = !this.followCam;
        break;
    }
  }

  private upTime: number = 0;
  private downTime: number = 0;

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

      case 'ArrowUp':
        this.upTime += this.store.getTickSpeed();
        if (this.upTime > 14) {
          this.getSelectedBrick()
            .getRenderer()
            .process('forward');
          this.upTime -= 15;
        }
        break;

      case 'ArrowDown':
        this.downTime += this.store.getTickSpeed();
        if (this.downTime > 14) {
          this.getSelectedBrick()
            .getRenderer()
            .process('backward');
          this.downTime -= 15;
        }
        break;
    }
  }

  tick() {
    const speed = this.store.getTickSpeed();
    for (let i = 0; i < speed; i++) {
      this.store.getAllOf(TYPES.Wagon).map((wagon: Wagon) => {
        wagon.tick();
      });

      if ((this.store.getTickCount() + i) % 120 === 0) {
        this.passengerGenerator.tick();
      }
    }
    this.store.tick();
    const count = Math.floor(this.store.getTickCount() / 60);
    this.vueSidebar.setData(
      'tickCount',
      Math.floor(count / 60) + ':' + (count % 60 < 10 ? '0' : '') + (count % 60)
    );
    this.vueSidebar.setData('tickSpeed', speed);
    this.vueSidebar.setData('fps', this.camera.getEngine().getFps().toFixed());

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
