import * as BABYLON from 'babylonjs';
import { OldController } from './OldController';
import { Store } from '../structs/Store/Store';
import { babylonContainer } from '../structs/inversify.config';
import { TYPES } from '../structs/TYPES';
import { TrackSwitch } from '../structs/TrackSwitch/TrackSwitch';
import { TrackJoint } from '../structs/TrackJoint/TrackJoint';
import { Track } from '../structs/Track/Track';
import { Coordinate } from '../structs/Geometry/Coordinate';
import { Platform } from '../structs/Platform/Platform';
import { Side } from '../structs/Platform/Side';
import { PassengerGenerator } from '../structs/Platform/PassengerGenerator';
import { Color } from '../structs/Color';

export class MouseController {
  private scene: BABYLON.Scene;
  private controller: OldController;

  private store: Store;

  private passengerGenerator: PassengerGenerator;
  private platformFactory: () => Platform;

  constructor() {
    const StoreFactory = babylonContainer.get<() => Store>(
      TYPES.FactoryOfStore
    );
    this.store = StoreFactory();

    this.platformFactory = babylonContainer.get<() => Platform>(
      TYPES.FactoryOfPlatform
    );

    this.passengerGenerator = new PassengerGenerator([], null);
  }

  setScene(scene: BABYLON.Scene) {
    this.scene = scene;
  }

  setController(controller: OldController) {
    this.controller = controller;
  }

  private platformFrom: {
    track: Track;
    positionOnTrack: number;
  } = null;

  handleMouseDown(ctrlKey, shiftKey) {
    const { pickedPoint, pickedMesh } = this.scene.pick(
      this.scene.pointerX,
      this.scene.pointerY
    );

    this.platformFrom = null;

    if (!pickedMesh) return;

    const meshId = pickedMesh.id;
    if (meshId.startsWith('clickable-')) {
      const [_, type, id] = meshId.split('-');
      const storedObj = this.store.get(id);
      // TODO this switch is not okay here
      switch (type) {
        case 'switchBox':
          const sw = storedObj as TrackSwitch;
          if (!sw) {
            console.log('sw found', id, sw);
            break;
          }

          if (shiftKey) {
            sw.verbose();
          } else {
            sw.switch();
          }
          break;

        case 'trackCoin':
          const t = storedObj as Track;
          if (!t) {
            console.log('t found', id, sw);
            break;
          }

          if (shiftKey) {
            t.verbose();
          } else if (ctrlKey) {
            if (t.isRemovable()) {
              t.remove();
            }
          }
          break;

        case 'track':
          const t1 = storedObj as Track;
          if (!t1) {
            console.log('t1 found', id, t1);
            break;
          }

          if (shiftKey) {
            //console.log('track', t1.getId(), pickedPoint, t1);
            const first = t1.getSegment().getFirstPoint();
            const last = t1.getSegment().getLastPoint();
            const len = first.distance2d(last);
            const lenFromStart = first.distance2d(
              new Coordinate(pickedPoint.x, pickedPoint.y, pickedPoint.z)
            );

            console.log('track', lenFromStart / len);
            this.platformFrom = {
              track: t1,
              positionOnTrack: lenFromStart
            };
          }
          break;

        case 'trackJoint':
          const joint = storedObj as TrackJoint;
          if (!joint) {
            console.log('joint found', id, joint);
            break;
          }

          const lastJoint = this.controller.getLastJoint();
          if (shiftKey) {
            joint.verbose();
          } else if (ctrlKey) {
            if (joint.remove()) {
              joint.deselect();
              if (lastJoint === joint) {
                this.controller.setLastJoint(null);
              }
            }
          } else {
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
      }
    } else {
      this.controller.createJoint(pickedPoint, shiftKey);
    }
  }

  handleMouseUp() {
    const { pickedPoint, pickedMesh } = this.scene.pick(
      this.scene.pointerX,
      this.scene.pointerY
    );

    if (!pickedMesh) return;

    const meshId = pickedMesh.id;
    if (meshId.startsWith('clickable-')) {
      const [_, type, id] = meshId.split('-');
      const storedObj = this.store.get(id);
      // TODO this switch is not okay here
      switch (type) {
        case 'track':
          const t1 = storedObj as Track;
          if (!t1) {
            console.log('t1 found', id, t1);
            break;
          }

          if (!this.platformFrom) return;

          const first = t1.getSegment().getFirstPoint();
          const last = t1.getSegment().getLastPoint();
          const len = first.distance2d(last);
          const lenFromStart = first.distance2d(
            new Coordinate(pickedPoint.x, pickedPoint.y, pickedPoint.z)
          );

          console.log('track up', lenFromStart / len);
          // this.platformFrom = {
          //   track: t1,
          //   positionOnTrack: lenFromStart
          // };

          const p = [this.platformFrom.positionOnTrack, lenFromStart].sort(
            (a, b) => parseInt(a.toString(), 10) - parseInt(b.toString(), 10)
          );
          if (t1 === this.platformFrom.track) {
            console.log('create');
            const pl = this.platformFactory().init(
              this.nameList[this.colorCount],
              t1,
              p[0],
              p[1],
              5,
              Side.Left,
              this.colorList[this.colorCount]
            );
            this.passengerGenerator.addToList(pl);
            console.log(pl);

            this.colorCount++;
          }
          break;
      }
    }
  }

  nameList: string[] = ['A', 'B', 'C', 'D', 'E'];
  colorList: Color[] = [
    new Color(1, 0, 0),
    new Color(1, 1, 0),
    new Color(0, 1, 0),
    new Color(0, 1, 1),
    new Color(0, 0, 1)
  ];
  colorCount: number = 0;

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
