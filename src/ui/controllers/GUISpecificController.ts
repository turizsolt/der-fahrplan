import { Coordinate } from '../../structs/Geometry/Coordinate';

export interface GUISpecificController {
  saveSpecific(): any;
  loadSpecific(obj: any): void;
  getFps(): string;
  setFollowCam(coord: Coordinate): void;
  modRadius(value: number): void;
  pick(event: any): any;
}
