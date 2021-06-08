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

  pick(event: any): any {
    return {
      pickedPoint: { x: event.data.global.x, y: 0, z: event.data.global.y },
      pickedMesh: { id: event.meshId }
    };
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
