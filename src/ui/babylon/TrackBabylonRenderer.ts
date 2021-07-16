import * as BABYLON from 'babylonjs';
import { TrackRenderer } from '../../structs/Renderers/TrackRenderer';
import { injectable, inject } from 'inversify';
import { Track } from '../../modules/Track/Track';
import { BaseBabylonRenderer } from './BaseBabylonRenderer';
import { Left, Right } from '../../structs/Geometry/Directions';
import { TYPES } from '../../di/TYPES';
import { MeshProvider } from './MeshProvider';
import { MaterialName } from './MaterialName';

@injectable()
export class TrackBabylonRenderer extends BaseBabylonRenderer
  implements TrackRenderer {
  private track: Track;
  @inject(TYPES.FactoryOfMeshProvider)
  private meshProviderFactory: () => MeshProvider;
  private meshProvider: MeshProvider;
  private selectableMeshes: BABYLON.AbstractMesh[];

  init(track: Track): void {
    this.track = track;
    this.meshProvider = this.meshProviderFactory();
    const chain = this.track.getCurve().getLineSegmentChain();
    const len = this.track.getCurve().getLength();

    const name = 'clickable-track-' + this.track.getId();

    const bedSegmentMeshes = chain
      .getRayPairs()
      .map(v => this.meshProvider.createBedSegmentMesh(v, name));

    /*
    const sleeperMeshes = chain
      .getEvenlySpacedRays(len / Math.floor(len))
      .map(v => this.meshProvider.createSleeperMesh(v, name));

    const leftRailMeshes = chain
      .copyMove(Left, 1)
      .getRayPairs()
      .map(rp => this.meshProvider.createRailSegmentMesh(rp, name));

    const rightRailMeshes = chain
      .copyMove(Right, 1)
      .getRayPairs()
      .map(rp => this.meshProvider.createRailSegmentMesh(rp, name));
*/
    this.meshes = [
      ...bedSegmentMeshes,
      /*
      ...sleeperMeshes,
      ...leftRailMeshes,
      ...rightRailMeshes
      */
    ];

    this.selectableMeshes = [/*...sleeperMeshes*/];
  }

  private lastSelected: boolean = false;

  update() {
    return;

    if (!this.track.isEmpty()) {
      this.selectableMeshes.map(
        x => (x.material = this.meshProvider.getMaterial(MaterialName.BedGray))
      );
    } else {
      if (this.selected && !this.lastSelected) {
        this.selectableMeshes.map(
          x =>
          (x.material = this.meshProvider.getMaterial(
            MaterialName.SelectorRed
          ))
        );
      } else if (!this.selected && this.lastSelected) {
        this.selectableMeshes.map(
          x =>
          (x.material = this.meshProvider.getMaterial(
            MaterialName.SleeperBrown
          ))
        );
      } else {
        this.selectableMeshes.map(
          x =>
          (x.material = this.meshProvider.getMaterial(
            MaterialName.SleeperBrown
          ))
        );
      }
    }

    this.lastSelected = this.selected;
  }

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
    null,
    true,
    BABYLON.Mesh.FRONTSIDE,
    prevMesh
  );
  var boxMaterial = new BABYLON.StandardMaterial('boxMat', null);
  boxMaterial.diffuseColor = normal
    ? new BABYLON.Color3(0, 0, 0)
    : new BABYLON.Color3(0.5, 0.5, 1);
  tube.material = boxMaterial;
  return tube;
};

export const curveToTube2 = (
  curve,
  normal = true,
  prevMesh = null,
  id = ''
) => {
  const tube = BABYLON.Mesh.CreateTube(
    'clickable-block-' + id,
    curve,
    0.5,
    8,
    null,
    0,
    null,
    true,
    BABYLON.Mesh.FRONTSIDE,
    prevMesh
  );
  return tube;
};
