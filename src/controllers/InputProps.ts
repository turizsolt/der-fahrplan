import * as BABYLON from 'babylonjs';
import { Ray } from '../structs/Geometry/Ray';
import { TrackJoint } from '../structs/TrackJoint/TrackJoint';
import { TrackBase } from '../structs/TrackBase/TrackBase';

export interface InputProps {
  point: Ray;
  mesh: BABYLON.AbstractMesh;
  snappedPoint: Ray;
  snappedPositionOnTrack: null | {
    distance: number;
    track: TrackBase;
    position: number;
  };
  snappedJoint: TrackJoint;

  wheelDeg: number;
  wheelRad: number;

  selected: Object;
  selectedMesh: BABYLON.AbstractMesh;
}
