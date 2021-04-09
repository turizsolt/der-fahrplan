import * as BABYLON from 'babylonjs';
import { CoordinateToBabylonVector3 } from './converters/CoordinateToBabylonVector3';
import { injectable, inject } from 'inversify';
import { BaseBabylonRenderer } from './BaseBabylonRenderer';
import { MeshProvider } from './MeshProvider';
import { TYPES } from '../../di/TYPES';
import { WagonRenderer } from '../../structs/Renderers/WagonRenderer';
import { MaterialName } from './MaterialName';
import { WagonData } from '../../modules/Train/WagonData';
import { Ray } from '../../structs/Geometry/Ray';

@injectable()
export class WagonBabylonRenderer extends BaseBabylonRenderer
  implements WagonRenderer {
  private mesh: BABYLON.AbstractMesh;
  readonly scene: BABYLON.Scene;

  private endBMesh: BABYLON.AbstractMesh;
  private selectedAMesh: BABYLON.AbstractMesh;

  @inject(TYPES.FactoryOfMeshProvider)
  private meshProviderFactory: () => MeshProvider;
  private meshProvider: MeshProvider;

  private inited: boolean = false;

  init(wagon: WagonData) {
    this.meshProvider = this.meshProviderFactory();

    this.mesh = this.meshProvider.createWagonMesh(
      wagon.appearanceId,
      'clickable-wagon-' + wagon.id
    );
    this.mesh.setEnabled(true);
    this.selectedAMesh = this.meshProvider.createSelectorMesh();
    this.endBMesh = this.meshProvider.createWagonEndMesh(
      'clickable-wagon-' + wagon.id + '-endB'
    );

    this.meshes = [this.mesh, this.selectedAMesh, this.endBMesh];

    this.inited = true;
    this.update(wagon);
  }

  update(wagon: WagonData) {
    if (!this.inited) return;
    if (!wagon.ray) return;

    const ray = Ray.fromData(wagon.ray);
    this.mesh.position = CoordinateToBabylonVector3(ray.coord);
    this.mesh.position.y = 4.2;
    this.mesh.rotation.y = ray.dirXZ + Math.PI / 2;

    if (wagon.isFirst) {
      const rayA = Ray.fromData(wagon.rayA);
      const matA = wagon.isTrainSelected
        ? MaterialName.SelectorRed
        : MaterialName.BedGray;
      this.selectedAMesh.position = CoordinateToBabylonVector3(rayA.coord);
      this.selectedAMesh.position.y = 10;
      this.selectedAMesh.material = this.meshProvider.getMaterial(matA);
      this.selectedAMesh.setEnabled(true);
    } else {
      this.selectedAMesh.setEnabled(false);
    }

    if (!wagon.isLast) {
      const rayB = Ray.fromData(wagon.rayB);
      this.endBMesh.position = CoordinateToBabylonVector3(rayB.coord);
      this.endBMesh.position.y = 10;
      this.endBMesh.material = this.meshProvider.getMaterial(
        MaterialName.SelectorRed
      );
      this.endBMesh.setEnabled(true);
    } else {
      this.endBMesh.setEnabled(false);
    }
  }
}
