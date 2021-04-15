import * as BABYLON from 'babylonjs';
import { injectable, inject } from 'inversify';
import { BaseBabylonRenderer } from './BaseBabylonRenderer';
import { TYPES } from '../../di/TYPES';
import { MeshProvider } from './MeshProvider';
import { BlockJointRenderer } from '../../structs/Renderers/BlockJointRenderer';
import { Ray } from '../../structs/Geometry/Ray';
import { CoordinateToBabylonVector3 } from './converters/CoordinateToBabylonVector3';

@injectable()
export class BlockJointBabylonRenderer extends BaseBabylonRenderer
  implements BlockJointRenderer {
  @inject(TYPES.FactoryOfMeshProvider)
  private meshProviderFactory: () => MeshProvider;
  private meshProvider: MeshProvider;
  private mesh: BABYLON.AbstractMesh;

  init(data: any): void {
    this.meshProvider = this.meshProviderFactory();
    this.mesh = this.meshProvider.createBlockJointMesh(
      'clickable-blockjoint-' + data.id
    );
    const ray = Ray.fromData(data.ray);
    this.mesh.position = CoordinateToBabylonVector3(ray.coord);
    this.mesh.position.y = 0.05;

    this.meshes = [this.mesh];
  }

  update(data: any): void {}
}
