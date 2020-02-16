import * as BABYLON from 'babylonjs';
import { TrackRenderer } from './TrackRenderer';
import { injectable } from 'inversify';
import { Track } from './Track';
import { CoordinateToBabylonVector3 } from '../CoordinateToBabylonVector3';
import {
  ballon,
  ballonUpdate
} from '../TrackSwitch/TrackSwitchBabylonRenderer';
import { Bezier } from '../Geometry/Bezier';

@injectable()
export class TrackBabylonRenderer implements TrackRenderer {
  private mesh: BABYLON.Mesh;
  private meshTC: BABYLON.Mesh;

  private balA: BABYLON.Mesh;
  private balB: BABYLON.Mesh;

  private phA: BABYLON.Mesh;
  private phB: BABYLON.Mesh;

  private track: Track;
  readonly scene: BABYLON.Scene;

  init(track: Track): void {
    this.track = track;

    const curve = this.track
      .getSegment()
      .getCurvePoints()
      .map(CoordinateToBabylonVector3);

    this.mesh = curveToTube(curve);

    const trackCoin = BABYLON.MeshBuilder.CreateCylinder(
      'clickable-trackCoin-' + this.track.getId(),
      {
        diameter: 3,
        tessellation: 24,
        height: 1
      },
      this.scene
    );

    const coord = this.track
      .getSegment()
      .getBezier()
      .getPoint(0.5);

    trackCoin.position = CoordinateToBabylonVector3(coord);

    var boxMaterial = new BABYLON.StandardMaterial('botMat', this.scene);
    boxMaterial.diffuseColor = BABYLON.Color3.Blue();
    trackCoin.material = boxMaterial;
    this.meshTC = trackCoin;

    const cl = Bezier.getLength(
      this.track
        .getSegment()
        .getBezier()
        .getCoordinates()
    );

    const cA = this.track
      .getSegment()
      .getBezier()
      .getPoint(4 / cl);
    this.balA = ballon(cA, this.track.getA().getConnectedTrack() ? 1 : 0);

    const cB = this.track
      .getSegment()
      .getBezier()
      .getPoint(1 - 4 / cl);
    this.balB = ballon(cB, this.track.getB().getConnectedTrack() ? 1 : 0);

    const pA = this.track
      .getSegment()
      .getBezier()
      .getPoint(7 / cl);
    this.phA = ballon(pA, this.track.getA().getConnectedEnd() ? 2 : 0);

    const pB = this.track
      .getSegment()
      .getBezier()
      .getPoint(1 - 7 / cl);
    this.phB = ballon(pB, this.track.getB().getConnectedEnd() ? 2 : 0);
  }

  update(): void {
    if (this.track.isRemoved()) {
      this.mesh.setEnabled(false);
      this.meshTC.setEnabled(false);

      this.balA.setEnabled(false);
      this.balB.setEnabled(false);
      this.phA.setEnabled(false);
      this.phB.setEnabled(false);
    } else {
      ballonUpdate(this.track.getA().getConnectedTrack() ? 1 : 0, this.balA);
      ballonUpdate(this.track.getB().getConnectedTrack() ? 1 : 0, this.balB);

      ballonUpdate(this.track.getA().getConnectedEnd() ? 2 : 0, this.phA);
      ballonUpdate(this.track.getB().getConnectedEnd() ? 2 : 0, this.phB);
    }
  }
}

export const curveToTube = (curve, normal = true, prevMesh = null) => {
  const tube = BABYLON.Mesh.CreateTube(
    'tube',
    curve,
    normal ? 0.5 : 0.2,
    16,
    null,
    0,
    this.scene,
    true,
    BABYLON.Mesh.FRONTSIDE,
    prevMesh
  );
  var boxMaterial = new BABYLON.StandardMaterial('boxMat', this.scene);
  boxMaterial.diffuseColor = normal
    ? new BABYLON.Color3(0, 0, 1)
    : new BABYLON.Color3(0.5, 0.5, 1);
  tube.material = boxMaterial;
  return tube;
};
