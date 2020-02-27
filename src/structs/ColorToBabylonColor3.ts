import * as BABYLON from 'babylonjs';
import { Color } from './Color';

export const ColorToBabylonColor3 = (c: Color): BABYLON.Color3 => {
  return new BABYLON.Color3(c.red, c.green, c.blue);
};
