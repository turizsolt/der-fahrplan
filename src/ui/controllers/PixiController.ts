import { GUISpecificController } from './GUISpecificController';
import { Coordinate } from '../../structs/Geometry/Coordinate';

export class PixiController implements GUISpecificController {
  constructor() {}

  getCamera(): BABYLON.ArcRotateCamera {
    return null;
  }

  getProps() {
    return null;
  }

  pick(): BABYLON.PickingInfo {
    return null;
  }

  modRadius(value: number): void {}

  setFollowCam(coord: Coordinate): void {}

  getFps(): string {
    return '-1';
  }

  saveSpecific(): any {
    return {};
  }

  loadSpecific(obj: any): void {}
}
