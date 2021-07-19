import * as BABYLON from 'babylonjs';
import { TrackRenderer } from '../../structs/Renderers/TrackRenderer';
import { injectable, inject } from 'inversify';
import { Track } from '../../modules/Track/Track';
import { BaseBabylonRenderer } from './BaseBabylonRenderer';
import { TYPES } from '../../di/TYPES';
import { MeshProvider } from './MeshProvider';
import { MaterialName } from './MaterialName';
import { renderTrackType } from './TrackTypeBabylonRenderer';

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

    const name = 'clickable-track-' + this.track.getId();

    const bedSegmentMeshes = renderTrackType(this.track.getTrackType(), this.track.getCurve(), this.meshProvider, name);

    this.meshes = [
      ...bedSegmentMeshes,
    ];

    this.selectableMeshes = [];

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
    /*
    ...sleeperMeshes,
    ...leftRailMeshes,
    ...rightRailMeshes
    */
    /*...sleeperMeshes*/
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
