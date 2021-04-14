import * as BABYLON from 'babylonjs';
import { InputHandler } from './InputHandler';
import { InputProps } from './InputProps';
import { CoordinateToBabylonVector3 } from '../babylon/converters/CoordinateToBabylonVector3';
import { ActualTrack } from '../../modules/Track/ActualTrack';
import { productionContainer } from '../../di/production.config';
import { TYPES } from '../../di/TYPES';
import { Store } from '../../structs/Interfaces/Store';
import { PositionOnTrack } from '../../modules/Train/PositionOnTrack';
import { TrackDirection } from '../../modules/Track/TrackDirection';
import { BlockJoint } from '../../modules/Signaling/BlockJoint';
import { Nearest } from '../../modules/Train/Nearest';
import { Block } from '../../modules/Signaling/Block';
import { WhichEnd } from '../../structs/Interfaces/WhichEnd';

export class CreateBlockJointInputHandler implements InputHandler {
  private fromMesh: BABYLON.Mesh;

  private store: Store;

  constructor() {
    this.store = productionContainer.get<() => Store>(TYPES.FactoryOfStore)();

    const mat = new BABYLON.StandardMaterial('boxMat', null);
    mat.diffuseColor = new BABYLON.Color3(0, 1, 1);

    this.fromMesh = BABYLON.MeshBuilder.CreateCylinder(
      'placeholder-1',
      {
        diameter: 3,
        tessellation: 24,
        height: 10,
        updatable: true
      },
      null
    );
    this.fromMesh.material = mat;
    this.fromMesh.setEnabled(false);
    this.fromMesh.isPickable = false;
  }

  down(props: InputProps, event: PointerEvent): void {}

  roam(props: InputProps, event: PointerEvent): void {
    const pot = props.snappedPositionOnTrack;
    if (pot && pot.track.constructor.name === ActualTrack.name) {
      this.fromMesh.position = CoordinateToBabylonVector3(
        pot.track
          .getCurve()
          .getBezier()
          .getPoint(pot.position)
      );

      this.fromMesh.setEnabled(!!pot);
    } else {
      this.fromMesh.setEnabled(false);
    }
  }

  move(downProps: InputProps, props: InputProps, event: PointerEvent): void {}

  click(downProps: InputProps, event: PointerEvent): void {
    const dpot = downProps.snappedPositionOnTrack;

    if (dpot && dpot.track.constructor.name === ActualTrack.name) {
      const position = PositionOnTrack.fromTrack(
        dpot.track,
        dpot.track.getLength() * dpot.position,
        TrackDirection.AB
      );
      const opposition = position.opposition();
      const blockJoint = this.store
        .create<BlockJoint>(TYPES.BlockJoint)
        .init(position);

      const nearestForward = Nearest.blockJoint(position);
      const nearestBackward = Nearest.blockJoint(opposition);

      // todo ez itt nem kezeli se azt, ha közbe ékelsz egy újat
      // todo se azt, ha van váltó útközben, ami tilos

      if (nearestForward.distance < Number.POSITIVE_INFINITY) {
        const block = this.store.create<Block>(TYPES.Block).init({
          startJointEnd: {
            end: convert(position.getDirectedTrack().getDirection()),
            joint: blockJoint
          },
          endJointEnd: {
            end: convert2(
              nearestForward.position.getDirectedTrack().getDirection()
            ),
            joint: nearestForward.blockJoint
          }
        });
      }

      if (nearestBackward.distance < Number.POSITIVE_INFINITY) {
        const block = this.store.create<Block>(TYPES.Block).init({
          startJointEnd: {
            end: convert(opposition.getDirectedTrack().getDirection()),
            joint: blockJoint
          },
          endJointEnd: {
            end: convert2(
              nearestBackward.position.getDirectedTrack().getDirection()
            ),
            joint: nearestBackward.blockJoint
          }
        });
      }
    }

    this.fromMesh.setEnabled(false);
  }

  up(downProps: InputProps, props: InputProps, event: PointerEvent): void {}

  cancel(): void {
    this.fromMesh.setEnabled(false);
  }
}

function convert2(t: TrackDirection): WhichEnd {
  if (t === TrackDirection.AB) return WhichEnd.B;
  if (t === TrackDirection.BA) return WhichEnd.A;
  return null;
}

function convert(t: TrackDirection): WhichEnd {
  if (t === TrackDirection.AB) return WhichEnd.A;
  if (t === TrackDirection.BA) return WhichEnd.B;
  return null;
}
