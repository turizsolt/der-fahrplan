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

export class InputController {
  private mode: string = 'CREATE_TRACK';
  private store: Store;

  private inputHandler: InputHandler;

  constructor(private scene: BABYLON.Scene) {
    this.inputHandler = new CreateTrackInputHandler();

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
      if (list[elem].constructor.name === ActualTrack.name) {
        trackList.push(list[elem]);
      }
      if (list[elem].constructor.name === ActualTrackJoint.name) {
        jointList.push(list[elem]);
      }
    }

    const ret = {
      point: point,
      mesh: pickedMesh,
      snappedPoint: snapXZ(point),
      snappedPositionOnTrack: snapPositionOnTrack(point, trackList),
      snappedJoint: snapJoint(point, jointList),
      wheelDeg: this.wheelRotation,
      wheelRad: (this.wheelRotation / 180) * Math.PI
    };
    ret.snappedPoint.dirXZ = ret.wheelRad;

    return ret;
  }

  down(event: PointerEvent) {
    const props = this.convert(event);
    if (props) this.inputHandler.down(props);
  }

  move(event: PointerEvent) {
    const props = this.convert(event);
    if (props) this.inputHandler.move(props);
  }

  up(event: PointerEvent) {
    const props = this.convert(event);
    if (props) this.inputHandler.up(props);
  }

  private wheelRotation = 0;

  wheel(event: WheelEvent) {
    const changeBy = 45 * Math.sign(event.deltaY);
    this.wheelRotation += changeBy;
    if (this.wheelRotation < -180) this.wheelRotation += 360;
    if (this.wheelRotation > 180) this.wheelRotation -= 360;

    const props = this.convert(null);
    if (props) this.inputHandler.move(props);
  }
}
