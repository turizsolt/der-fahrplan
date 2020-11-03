import * as BABYLON from 'babylonjs';
import { Ray } from '../../structs/Geometry/Ray';
import { TrackJoint } from '../../structs/Interfaces/TrackJoint';
import { TrackBase } from '../../structs/Interfaces/TrackBase';
import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { BaseStorable } from '../../structs/Interfaces/BaseStorable';

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

  selected: BaseStorable;

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

  wagonType: string;
}
