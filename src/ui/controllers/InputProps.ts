import * as BABYLON from 'babylonjs';
import { Ray } from '../../structs/Geometry/Ray';
import { TrackJoint } from '../../modules/Track/TrackJoint/TrackJoint';
import { TrackBase } from '../../modules/Track/TrackBase';

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
}
