import * as BABYLON from 'babylonjs';
import { injectable, inject } from 'inversify';
import { BaseBabylonRenderer } from './BaseBabylonRenderer';
import { TYPES } from '../../di/TYPES';
import { MeshProvider } from './MeshProvider';
import { BlockJointRenderer } from '../../structs/Renderers/BlockJointRenderer';
import { Ray } from '../../structs/Geometry/Ray';
import { CoordinateToBabylonVector3 } from './converters/CoordinateToBabylonVector3';
import { MaterialName } from './MaterialName';

@injectable()
export class BlockJointBabylonRenderer extends BaseBabylonRenderer
  implements BlockJointRenderer {
  @inject(TYPES.FactoryOfMeshProvider)
  private meshProviderFactory: () => MeshProvider;
  private meshProvider: MeshProvider;
  private mesh: BABYLON.AbstractMesh;
  private meshA: BABYLON.AbstractMesh;
  private meshB: BABYLON.AbstractMesh;

  init(data: any): void {
    this.meshProvider = this.meshProviderFactory();
    this.mesh = this.meshProvider.createBlockJointMesh(
      'clickable-blockjoint-' + data.id
    );
    this.meshA = this.meshProvider.createBlockJointMesh(
      'clickable-blockjoint-' + data.id
    );
    this.meshB = this.meshProvider.createBlockJointMesh(
      'clickable-blockjoint-' + data.id
    );
    const ray = Ray.fromData(data.ray);
    this.mesh.position = CoordinateToBabylonVector3(ray.coord);
    this.mesh.position.y = 2;
    this.mesh.setEnabled(false);

    const rayA = ray.fromHere(0, 0.5);
    this.meshA.position = CoordinateToBabylonVector3(rayA.coord);
    this.meshA.position.y = 2;
    this.meshA.material = this.meshProvider.getMaterial(MaterialName.Amber);
    this.meshA.rotation.y = rayA.dirXZ + Math.PI / 6;

    const rayB = ray.fromHere(Math.PI, 0.5);
    this.meshB.position = CoordinateToBabylonVector3(rayB.coord);
    this.meshB.position.y = 2;
    this.meshB.material = this.meshProvider.getMaterial(MaterialName.Blue);
    this.meshB.rotation.y = rayB.dirXZ - Math.PI / 6;

    this.meshes = [this.mesh, this.meshA, this.meshB];
  }

  update(data: any): void {}
}
