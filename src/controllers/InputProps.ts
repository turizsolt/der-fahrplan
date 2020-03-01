import * as BABYLON from 'babylonjs';
import { Ray } from '../structs/Geometry/Ray';
import { TrackJoint } from '../structs/TrackJoint/TrackJoint';
import { TrackBase } from '../structs/TrackBase/TrackBase';
import { BaseBrick } from '../structs/Base/BaseBrick';

export interface InputProps {
  point: Ray;
  mesh: BABYLON.AbstractMesh;
  snappedPoint: Ray;
  snappedPositionOnTrack: null | {
    distance: number;
    track: TrackBase;
    position: number;
    segment: string;
  };

  snappedJoint: TrackJoint;
  snappedJointOnTrack: null | {
    distance: number;
    track: TrackBase;
    position: number;
    segment: string;
  };

  wheelDeg: number;
  wheelRad: number;

  selected: BaseBrick;
  selectedMesh: BABYLON.AbstractMesh;

  cameraRadius: number;
  cameraAlpha: number;
  cameraBeta: number;

  pointerX: number;
  pointerY: number;

  targetX: number;
  targetZ: number;

  fromX: number;
  fromY: number;
  fromZ: number;
}
