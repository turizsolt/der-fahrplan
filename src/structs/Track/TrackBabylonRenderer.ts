import * as BABYLON from 'babylonjs';
import { TrackRenderer } from './TrackRenderer';
import { injectable } from 'inversify';
import { Track } from './Track';
import { CoordinateToBabylonVector3 } from '../CoordinateToBabylonVector3';

@injectable()
export class TrackBabylonRenderer implements TrackRenderer {
  private mesh: BABYLON.Mesh;
  private track: Track;
  readonly scene: BABYLON.Scene;

  init(track: Track): void {
    this.track = track;

    const curve = this.track
      .getSegment()
      .getCurvePoints()
      .map(CoordinateToBabylonVector3);

    this.mesh = curveToTube(curve);
  }

  update(): void {
    if (this.track.isRemoved) {
      this.mesh.setEnabled(false);
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
