import * as BABYLON from 'babylonjs';
import { injectable, inject } from 'inversify';
import { BaseBabylonRenderer } from './BaseBabylonRenderer';
import { TYPES } from '../../di/TYPES';
import { MeshProvider } from './MeshProvider';
import { BlockRenderer } from '../../structs/Renderers/BlockRenderer';
import { Ray } from '../../structs/Geometry/Ray';
import { CoordinateToBabylonVector3 } from './converters/CoordinateToBabylonVector3';
import { MaterialName } from './MaterialName';
import { Right } from '../../structs/Geometry/Directions';
import { curveToTube2 } from './TrackBabylonRenderer';

@injectable()
export class BlockBabylonRenderer extends BaseBabylonRenderer
  implements BlockRenderer {
  @inject(TYPES.FactoryOfMeshProvider)
  private meshProviderFactory: () => MeshProvider;
  private meshProvider: MeshProvider;
  private meshA: BABYLON.AbstractMesh;
  private meshB: BABYLON.AbstractMesh;
  private pathMesh: BABYLON.AbstractMesh;
  private inited = false;

  init(data: any): void {
    this.meshProvider = this.meshProviderFactory();
    this.meshA = this.meshProvider.createBlockMesh(
      'clickable-block-' + data.id
    );
    const rayA = Ray.fromData(data.rayA)
      .fromHere(Right, 5)
      .fromHere(0, 3);
    this.meshA.position = CoordinateToBabylonVector3(rayA.coord);
    this.meshA.position.y = 0.15;

    this.meshB = this.meshProvider.createBlockMesh(
      'clickable-block-' + data.id
    );
    const rayB = Ray.fromData(data.rayB)
      .fromHere(Right, 5)
      .fromHere(Math.PI, 3);
    this.meshB.position = CoordinateToBabylonVector3(rayB.coord);
    this.meshB.position.y = 0.15;

    this.pathMesh = curveToTube2(
      data.coords.map(a => CoordinateToBabylonVector3({ ...a, y: 1.5 })),
      false,
      this.pathMesh,
      data.id
    );
    this.pathMesh.material = this.meshProvider.getMaterial(
      MaterialName.BedGray
    );

    this.meshes = [this.meshA, this.meshB, this.pathMesh];
    this.inited = true;
    this.update(data);
  }

  update(data: any): void {
    if (!this.inited) return;

    const matName = data.isFree
      ? MaterialName.AllowingGreen
      : MaterialName.ShuntingRed;
    this.meshA.material = this.meshProvider.getMaterial(matName);
    this.meshB.material = this.meshProvider.getMaterial(matName);
    this.pathMesh.material = this.meshProvider.getMaterial(matName);
  }
}
