import * as BABYLON from 'babylonjs';
import { babylonContainer } from '../structs/inversify.config';
import { TYPES } from '../structs/TYPES';
import { TrackJoint } from '../structs/TrackJoint/TrackJoint';
import { MouseRenderer } from './MouseRenderer';

export class Controller {
  private viewMode = 0;
  private camera: BABYLON.Camera;
  private canvas: HTMLElement;
  private scene: BABYLON.Scene;
  private mouseRenderer: MouseRenderer;
  private snappedPoint: BABYLON.Vector3 = new BABYLON.Vector3(0, 0, 0);

  setCameraAndCanvas(camera, canvas) {
    this.camera = camera;
    this.canvas = canvas;
    this.setViewMode(0);
  }

  setScene(scene: BABYLON.Scene) {
    this.scene = scene;
    this.mouseRenderer = new MouseRenderer().init(this.scene);
  }

  nextViewMode() {
    this.setViewMode((this.viewMode + 1) % 2);
  }

  setViewMode(viewMode) {
    this.viewMode = viewMode;

    switch (this.viewMode) {
      case 0:
        this.camera.attachControl(this.canvas, true);
        break;
      case 1:
        this.camera.detachControl(this.canvas);
        break;
    }

    if (this.mouseRenderer && this.snappedPoint) {
      this.mouseRenderer.update(
        this.snappedPoint,
        this.getPickedRotationRad(),
        this.viewMode
      );
    }
  }

  getViewMode() {
    return this.viewMode;
  }

  private pickedRotationDegree = 0;

  changeRotation(changeBy: number) {
    this.pickedRotationDegree += changeBy;
    if (this.pickedRotationDegree < -180) this.pickedRotationDegree += 360;
    if (this.pickedRotationDegree > 180) this.pickedRotationDegree -= 360;
    if (this.mouseRenderer) {
      this.mouseRenderer.update(
        this.snappedPoint,
        this.getPickedRotationRad(),
        this.viewMode
      );
    }
  }

  setRotation(changeTo: number) {
    this.changeRotation(changeTo - this.pickedRotationDegree);
  }

  getPickedRotationRad(): number {
    return (this.pickedRotationDegree / 180) * Math.PI;
  }

  private lastJoint: TrackJoint;

  setLastJoint(joint: TrackJoint): void {
    if (this.lastJoint) {
      this.lastJoint.deselect();
    }
    this.lastJoint = joint;
    if (joint) {
      this.lastJoint.select();
      // this.setRotation(joint.getRotation());
    }
  }

  getLastJoint(): TrackJoint {
    return this.lastJoint;
  }

  createJoint(pickedPoint, lastStays) {
    if (this.viewMode !== 1) return;
    // todo antipattern to get here
    const joint = babylonContainer.get<TrackJoint>(TYPES.TrackJoint);
    const snappedPoint = snapXZ(pickedPoint);
    joint.init(snappedPoint.x, snappedPoint.z, this.getPickedRotationRad());

    if (this.lastJoint) {
      this.lastJoint.connect(joint);
    }

    if (!lastStays) this.setLastJoint(joint);
  }

  setMousePoint(pickedPoint) {
    if (this.viewMode !== 1) return;
    const snappedPoint = snapXZ(pickedPoint);
    this.snappedPoint = snappedPoint;
    this.mouseRenderer.update(
      this.snappedPoint,
      this.getPickedRotationRad(),
      this.viewMode
    );
  }
}

function snapXZ(p) {
  return new BABYLON.Vector3(snap(p.x), -0.6, snap(p.z));
}

function snap(p) {
  const diff = p % 5;
  if (diff < 2.5 || diff >= 2.5) return Math.round(p / 5) * 5;
  return p;
}
