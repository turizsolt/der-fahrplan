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

export class InputController {
  private mode: string = 'CREATE_TRACK';
  private store: Store;

  private inputHandler: InputHandler;

  private downProps: InputProps;
  private selectedMesh: BABYLON.AbstractMesh;
  private selected: BaseBrick;

  constructor(private scene: BABYLON.Scene) {
    this.inputHandler = new CreateTrackInputHandler();

    this.downProps = null;
    this.store = babylonContainer.get<() => Store>(TYPES.FactoryOfStore)();
  }

  convert(event: PointerEvent): InputProps {
    const { pickedPoint, pickedMesh } = this.scene.pick(
      this.scene.pointerX,
      this.scene.pointerY
    );

    if (!pickedPoint) return null;

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
      selectedMesh: this.selectedMesh
    };
    ret.snappedPoint.dirXZ = ret.wheelRad;

    return ret;
  }

  down(event: PointerEvent) {
    const props = this.convert(event);
    this.downProps = props;
    if (props) this.inputHandler.down(props);
  }

  move(event: PointerEvent) {
    const props = this.convert(event);
    if (this.downProps) {
      if (props) this.inputHandler.move(this.downProps, props);
    } else {
      if (props) this.inputHandler.roam(props);
    }
  }

  up(event: PointerEvent) {
    let props = this.convert(event);
    if (this.downProps.point.coord.equalsTo(props.point.coord)) {
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

      if (!ready && props) this.inputHandler.click(this.downProps);
      if (ready && props) this.inputHandler.cancel();
    } else {
      if (props) this.inputHandler.up(this.downProps, props);
    }
    this.downProps = null;
  }

  private wheelRotation = 0;

  wheel(event: WheelEvent) {
    const changeBy = 45 * Math.sign(event.deltaY);
    this.wheelRotation += changeBy;
    if (this.wheelRotation < -180) this.wheelRotation += 360;
    if (this.wheelRotation > 180) this.wheelRotation -= 360;

    const props = this.convert(null);
    if (props) this.move(null);
  }

  keyDown(key: string, mods: { shift: boolean; ctrl: boolean }): void {}

  keyUp(key: string, mods: { shift: boolean; ctrl: boolean }): void {
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
