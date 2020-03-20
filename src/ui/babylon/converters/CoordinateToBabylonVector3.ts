import * as BABYLON from 'babylonjs';
import { Coordinate } from '../../../structs/Geometry/Coordinate';

export const CoordinateToBabylonVector3 = (v: Coordinate): BABYLON.Vector3 => {
  return new BABYLON.Vector3(v.x, v.y, v.z);
};
