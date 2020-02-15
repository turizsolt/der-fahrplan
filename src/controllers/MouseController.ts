import * as BABYLON from 'babylonjs';
import { Controller } from './Controller';
import { Store } from '../structs/Store/Store';
import { babylonContainer } from '../structs/inversify.config';
import { TYPES } from '../structs/TYPES';
import { TrackSwitch } from '../structs/TrackSwitch/TrackSwitch';
import { TrackJoint } from '../structs/TrackJoint/TrackJoint';

export class MouseController {
  private scene: BABYLON.Scene;
  private controller: Controller;

  private store: Store;

  constructor() {
    const StoreFactory = babylonContainer.get<() => Store>(
      TYPES.FactoryOfStore
    );
    this.store = StoreFactory();
  }

  setScene(scene: BABYLON.Scene) {
    this.scene = scene;
  }

  setController(controller: Controller) {
    this.controller = controller;
  }

  handleMouseDown() {
    const { pickedPoint, pickedMesh } = this.scene.pick(
      this.scene.pointerX,
      this.scene.pointerY
    );

    const meshId = pickedMesh.id;
    if (meshId.startsWith('clickable-')) {
      const [_, type, id] = meshId.split('-');
      const storedObj = this.store.get(id);
      // TODO this switch is not okay here
      switch (type) {
        case 'switchBox':
          const sw = storedObj as TrackSwitch;
          sw.switch();
          break;

        case 'trackJoint':
          const joint = storedObj as TrackJoint;
          const lastJoint = this.controller.getLastJoint();
          if (lastJoint === joint) {
            joint.deselect();
            this.controller.setLastJoint(null);
          } else if (!lastJoint) {
            this.controller.setLastJoint(joint);
          } else {
            lastJoint.connect(joint);
            this.controller.setLastJoint(joint);
          }
          break;
      }
    } else {
      this.controller.createJoint(pickedPoint);
    }
  }

  handleMouseUp() {}

  handleMouseMove() {
    const { pickedPoint } = this.scene.pick(
      this.scene.pointerX,
      this.scene.pointerY
    );

    if (!pickedPoint) return;

    this.controller.setMousePoint(pickedPoint);
  }

  handleWheel(delta, ctrlKey) {
    this.controller.changeRotation(delta * (ctrlKey ? 15 : 45));
  }
}
