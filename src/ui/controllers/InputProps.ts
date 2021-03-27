import * as BABYLON from 'babylonjs';
import { Ray } from '../../structs/Geometry/Ray';
import { TrackJoint } from '../../modules/Track/TrackJoint/TrackJoint';
import { TrackBase } from '../../modules/Track/TrackBase';
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
