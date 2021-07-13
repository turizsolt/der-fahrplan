import * as BABYLON from 'babylonjs';
import { injectable, inject } from 'inversify';
import { BaseBabylonRenderer } from './BaseBabylonRenderer';
import { TYPES } from '../../di/TYPES';
import { MeshProvider } from './MeshProvider';
import { SectionRenderer } from '../../structs/Renderers/SectionRenderer';
import { Ray } from '../../structs/Geometry/Ray';
import { CoordinateToBabylonVector3 } from './converters/CoordinateToBabylonVector3';
import { MaterialName } from './MaterialName';

@injectable()
export class SectionBabylonRenderer extends BaseBabylonRenderer
  implements SectionRenderer {
  @inject(TYPES.FactoryOfMeshProvider)
  private meshProviderFactory: () => MeshProvider;
  private meshProvider: MeshProvider;
  private meshA: BABYLON.AbstractMesh;
  private meshB: BABYLON.AbstractMesh;

  init(data: any): void {
    return;

    this.meshProvider = this.meshProviderFactory();

    this.meshA = this.meshProvider.createSectionMesh(
      'clickable-block-' + data.id
    );
    const rayA = Ray.fromData(data.rayA);
    this.meshA.position = CoordinateToBabylonVector3(rayA.coord);
    this.meshA.position.y = 2;

    this.meshB = this.meshProvider.createSectionMesh(
      'clickable-block-' + data.id
    );
    const rayB = Ray.fromData(data.rayB);
    this.meshB.position = CoordinateToBabylonVector3(rayB.coord);
    this.meshB.position.y = 2;

    this.meshes = [this.meshA, this.meshB];

    this.update(data);
  }

  update(data: any): void {
    return;

    const bothFree = data.isFreeA && data.isFreeB;
    this.meshA.material = this.meshProvider.getMaterial(
      bothFree
        ? MaterialName.SelectorRed
        : data.isFreeA
          ? MaterialName.AllowingGreen
          : MaterialName.ShuntingRed
    );
    this.meshB.material = this.meshProvider.getMaterial(
      bothFree
        ? MaterialName.SelectorRed
        : data.isFreeB
          ? MaterialName.AllowingGreen
          : MaterialName.ShuntingRed
    );
  }
}
