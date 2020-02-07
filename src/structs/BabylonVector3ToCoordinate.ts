import * as BABYLON from 'babylonjs';
import { Coordinate } from './Coordinate';

export const BabylonVector3ToCoordinate = (v: BABYLON.Vector3): Coordinate => {
  return new Coordinate(v.x, v.y, v.z);
};
