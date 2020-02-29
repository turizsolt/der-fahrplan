import * as BABYLON from 'babylonjs';
import { InputHandler } from './InputHandler';
import { CreateTrackInputHandler } from './CreateTrackInputHandler';
import { BabylonVector3ToCoordinate } from '../structs/BabylonVector3ToCoordinate';
import { Ray } from '../structs/Geometry/Ray';
import {
  snapXZ,
  snapPositionOnTrack,
  snapJoint
} from '../structs/Geometry/Snap';
import { babylonContainer } from '../structs/inversify.config';
import { Store } from '../structs/Store/Store';
import { TYPES } from '../structs/TYPES';
import { ActualTrack } from '../structs/Track/ActualTrack';
import { TrackBase } from '../structs/TrackBase/TrackBase';
import { TrackJoint } from '../structs/TrackJoint/TrackJoint';
import { ActualTrackJoint } from '../structs/TrackJoint/ActualTrackJoint';
import { InputProps } from './InputProps';
import { BaseBrick } from '../structs/Base/BaseBrick';
import { ActualTrackSwitch } from '../structs/TrackSwitch/ActualTrackSwitch';
import { CameraInputHandler } from './CameraInputHandler';
import { SelectInputHandler } from './SelectInputHandler';
import { CreatePlatformInputHandler } from './CreatePlatformInputHandler';

export enum InputMode {
  CAMERA = 'CAMERA',
  SELECT = 'SELECT',
  CREATE_TRACK = 'CREATE_TRACK',
  CREATE_PLATFORM = 'CREATE_PLATFORM'
}

export class InputController {
  private mode: InputMode = InputMode.CAMERA;
  private store: Store;

  private inputHandler: InputHandler;
  private inputHandlers: Record<InputMode, InputHandler>;

  private downProps: InputProps;
  private selectedMesh: BABYLON.AbstractMesh;
  private selected: BaseBrick;

  private mouseButtons: boolean[] = [];

  constructor(
    private scene: BABYLON.Scene,
    private camera: BABYLON.ArcRotateCamera
  ) {
    document.getElementById('input-cam').addEventListener('click', () => {
      this.inputHandler.cancel();
      this.mode = InputMode.CAMERA;
      this.inputHandler = this.inputHandlers[this.mode];
      updBoxes(this.mode);
    });

    document.getElementById('input-sel').addEventListener('click', () => {
      this.inputHandler.cancel();
      this.mode = InputMode.SELECT;
      this.inputHandler = this.inputHandlers[this.mode];
      updBoxes(this.mode);
    });

    document.getElementById('input-nt').addEventListener('click', () => {
      this.inputHandler.cancel();
      this.mode = InputMode.CREATE_TRACK;
      this.inputHandler = this.inputHandlers[this.mode];
      updBoxes(this.mode);
    });

    document.getElementById('input-np').addEventListener('click', () => {
      this.inputHandler.cancel();
      this.mode = InputMode.CREATE_PLATFORM;
      this.inputHandler = this.inputHandlers[this.mode];
      updBoxes(this.mode);
    });

    this.inputHandlers = {
      [InputMode.CAMERA]: new CameraInputHandler(camera),
      [InputMode.SELECT]: new SelectInputHandler(),
      [InputMode.CREATE_TRACK]: new CreateTrackInputHandler(),
      [InputMode.CREATE_PLATFORM]: new CreatePlatformInputHandler()
    };

    this.inputHandler = this.inputHandlers[this.mode];
    updBoxes(this.mode);

    this.downProps = null;
    this.store = babylonContainer.get<() => Store>(TYPES.FactoryOfStore)();
  }

  convert(event: PointerEvent): InputProps {
    const { pickedPoint, pickedMesh } = this.scene.pick(
      this.scene.pointerX,
      this.scene.pointerY
    );

    if (!pickedPoint) {
      const ret = {
        point: null,
        mesh: pickedMesh,
        snappedPoint: null,
        snappedPositionOnTrack: null,
        snappedJoint: null,
        wheelDeg: this.wheelRotation,
        wheelRad: (this.wheelRotation / 180) * Math.PI,
        selected: this.selected,
        selectedMesh: this.selectedMesh,
        cameraRadius: this.camera.radius,
        cameraAlpha: this.camera.alpha,
        cameraBeta: this.camera.beta,
        pointerX: this.scene.pointerX,
        pointerY: this.scene.pointerY,
        targetX: this.camera.target.x,
        targetZ: this.camera.target.z,
        fromX: this.camera.position.x,
        fromY: this.camera.position.y,
        fromZ: this.camera.position.z
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

    const ret = {
      point: point,
      mesh: pickedMesh,
      snappedPoint: snapXZ(point),
      snappedPositionOnTrack: snapPositionOnTrack(point, trackList),
      snappedJoint: snapJoint(point, jointList),
      wheelDeg: this.wheelRotation,
      wheelRad: (this.wheelRotation / 180) * Math.PI,
      selected: this.selected,
      selectedMesh: this.selectedMesh,
      cameraRadius: this.camera.radius,
      cameraAlpha: this.camera.alpha,
      cameraBeta: this.camera.beta,
      pointerX: this.scene.pointerX,
      pointerY: this.scene.pointerY,
      targetX: this.camera.target.x,
      targetZ: this.camera.target.z,
      fromX: this.camera.position.x,
      fromY: this.camera.position.y,
      fromZ: this.camera.position.z
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
    let props = this.convert(event);

    if (
      this.downProps.point &&
      this.downProps.point.coord.equalsTo(props.point.coord)
    ) {
      let ready = this.selectIfPossible();
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

  private selectIfPossible() {
    let ready = false;
    if (this.downProps.mesh) {
      const meshId = this.downProps.mesh.id;
      if (meshId.startsWith('clickable-')) {
        const [_, type, id] = meshId.split('-');
        const storedObj = this.store.get(id);
        if (storedObj) {
          let renderer = storedObj.getRenderer();
          if (renderer.isSelected()) {
            renderer.setSelected(false);
            this.selected = null;
            this.selectedMesh = null;
          } else {
            if (this.selected) {
              this.selected.getRenderer().setSelected(false);
            }
            renderer.setSelected(true);
            this.selected = storedObj;
            this.selectedMesh = this.downProps.mesh;
          }
          ready = true;
        }
      }
    }
    return ready;
  }

  wheel(event: WheelEvent) {
    if (this.mouseButtons[1]) {
      this.camera.radius += 5 * Math.sign(event.deltaY);
    } else {
      const changeBy = 45 * Math.sign(event.deltaY);
      this.wheelRotation += changeBy;
      if (this.wheelRotation < -180) this.wheelRotation += 360;
      if (this.wheelRotation > 180) this.wheelRotation -= 360;

      const props = this.convert(null);
      if (props.point) this.move(null);
    }
  }

  keyDown(key: string, mods: { shift: boolean; ctrl: boolean }): void {}

  keyUp(key: string, mods: { shift: boolean; ctrl: boolean }): void {
    switch (key) {
      case 'U':
        this.inputHandler.cancel();
        this.mode = InputMode.CAMERA;
        this.inputHandler = this.inputHandlers[this.mode];
        updBoxes(this.mode);
        break;

      case 'I':
        this.inputHandler.cancel();
        this.mode = InputMode.SELECT;
        this.inputHandler = this.inputHandlers[this.mode];
        updBoxes(this.mode);
        break;

      case 'O':
        console.log('o');
        this.inputHandler.cancel();
        this.mode = InputMode.CREATE_TRACK;
        this.inputHandler = this.inputHandlers[this.mode];
        updBoxes(this.mode);
        break;

      case 'P':
        this.inputHandler.cancel();
        this.mode = InputMode.CREATE_PLATFORM;
        this.inputHandler = this.inputHandlers[this.mode];
        updBoxes(this.mode);
        break;
    }

    if (!this.selected) return;

    switch (key) {
      case 'Delete':
        this.selected.getRenderer().process('delete');
        break;

      case 'Enter':
        this.selected.getRenderer().process('stop');
        break;

      case 'S':
        this.selected.getRenderer().process('switch');
        break;
    }
  }

  keyHold(key: string, mods: { shift: boolean; ctrl: boolean }): void {
    if (!this.selected) return;

    switch (key) {
      case 'ArrowUp':
        this.selected.getRenderer().process('forward');
        break;

      case 'ArrowDown':
        this.selected.getRenderer().process('backward');
        break;
    }
  }
}

const choices = {
  [InputMode.CAMERA]: 'input-cam',
  [InputMode.SELECT]: 'input-sel',
  [InputMode.CREATE_TRACK]: 'input-nt',
  [InputMode.CREATE_PLATFORM]: 'input-np'
};

function updBoxes(chosen: InputMode) {
  document.getElementById('input-cam').classList.remove('selected');
  document.getElementById('input-sel').classList.remove('selected');
  document.getElementById('input-nt').classList.remove('selected');
  document.getElementById('input-np').classList.remove('selected');

  document.getElementById(choices[chosen]).classList.add('selected');
}
