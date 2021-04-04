import * as BABYLON from 'babylonjs';
import { TrackJointRenderer } from '../../structs/Renderers/TrackJointRenderer';
import { injectable, inject } from 'inversify';
import { BaseBabylonRenderer } from './BaseBabylonRenderer';
import { MeshProvider } from './MeshProvider';
import { TYPES } from '../../di/TYPES';
import { MaterialName } from './MaterialName';
import { Ray } from '../../structs/Geometry/Ray';
import { Coordinate } from '../../structs/Geometry/Coordinate';

@injectable()
export class TrackJointBabylonRenderer extends BaseBabylonRenderer
  implements TrackJointRenderer {
  private mesh: BABYLON.AbstractMesh;
  readonly scene: BABYLON.Scene;

  @inject(TYPES.FactoryOfMeshProvider)
  private meshProviderFactory: () => MeshProvider;
  private meshProvider: MeshProvider;

  init(data: any) {
    this.meshProvider = this.meshProviderFactory();

    this.mesh = this.meshProvider.createSleeperJointMesh(
      new Ray(new Coordinate(data.ray.x, data.ray.y, data.ray.z), data.ray.dirXZ),
      'clickable-trackJoint-' + data.id
    );
    this.meshes = [this.mesh];
  }

  update(data: any): void {
    this.mesh.material = this.selected
      ? this.meshProvider.getMaterial(MaterialName.SelectorRed)
      : this.meshProvider.getMaterial(MaterialName.RailBlack);
  }
}
