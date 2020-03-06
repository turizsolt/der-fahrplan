import * as BABYLON from 'babylonjs';
import { TrackRenderer } from './TrackRenderer';
import { injectable, inject } from 'inversify';
import { Track } from './Track';
import { BaseBabylonRenderer } from '../Base/BaseBabylonRenderer';
import { Left, Right } from '../Geometry/Directions';
import { TYPES } from '../TYPES';
import { MeshProvider } from '../../babylon/MeshProvider';

@injectable()
export class TrackBabylonRenderer extends BaseBabylonRenderer
  implements TrackRenderer {
  private track: Track;
  @inject(TYPES.FactoryOfMeshProvider)
  private meshProviderFactory: () => MeshProvider;
  private meshProvider: MeshProvider;

  init(track: Track): void {
    this.track = track;
    this.meshProvider = this.meshProviderFactory();
    const bezier = this.track.getSegment().getBezier();
    const len = this.track.getSegment().getLength();

    const bedSegmentMeshes = bezier
      .getLinePairRays()
      .map(v => this.meshProvider.createBedSegmentMesh(v));

    const sleeperMeshes = bezier
      .getLineOffRays(Math.floor(len / 2))
      .map(v => this.meshProvider.createSleeperMesh(v));

    const leftRailMeshes = bezier
      .getLinePairRays()
      .map(([r1, r2]) =>
        this.meshProvider.createRailSegmentMesh([
          r1.fromHere(Left, 1),
          r2.fromHere(Left, 1)
        ])
      );

    const rightRailMeshes = bezier
      .getLinePairRays()
      .map(([r1, r2]) =>
        this.meshProvider.createRailSegmentMesh([
          r1.fromHere(Right, 1),
          r2.fromHere(Right, 1)
        ])
      );

    this.meshes = [
      ...bedSegmentMeshes,
      ...sleeperMeshes,
      ...leftRailMeshes,
      ...rightRailMeshes
    ];
  }

  update(): void {}

  process(command: string) {
    switch (command) {
      case 'delete':
        this.track.remove();
        break;
    }
  }
}

// todo remove
export const curveToTube = (curve, normal = true, prevMesh = null, id = '') => {
  const tube = BABYLON.Mesh.CreateTube(
    'clickable-track-' + id,
    curve,
    normal ? 0.3 : 0.2,
    8,
    null,
    0,
    this.scene,
    true,
    BABYLON.Mesh.FRONTSIDE,
    prevMesh
  );
  var boxMaterial = new BABYLON.StandardMaterial('boxMat', this.scene);
  boxMaterial.diffuseColor = normal
    ? new BABYLON.Color3(0, 0, 0)
    : new BABYLON.Color3(0.5, 0.5, 1);
  tube.material = boxMaterial;
  return tube;
};
