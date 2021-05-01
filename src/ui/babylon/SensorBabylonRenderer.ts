import * as BABYLON from 'babylonjs';
import { injectable, inject } from 'inversify';
import { BaseBabylonRenderer } from './BaseBabylonRenderer';
import { TYPES } from '../../di/TYPES';
import { MeshProvider } from './MeshProvider';
import { Ray } from '../../structs/Geometry/Ray';
import { MaterialName } from './MaterialName';
import { SensorRenderer } from '../../structs/Renderers/SensorRenderer';

@injectable()
export class SensorBabylonRenderer extends BaseBabylonRenderer
  implements SensorRenderer {
  @inject(TYPES.FactoryOfMeshProvider)
  private meshProviderFactory: () => MeshProvider;
  private meshProvider: MeshProvider;

  private dotMesh: BABYLON.AbstractMesh;

  init(data: any): void {
    this.meshProvider = this.meshProviderFactory();
    const rayPost = Ray.fromData(data.ray);
    this.dotMesh = this.meshProvider.createSensorMesh(
      rayPost,
      'clickable-sensor-' + data.id
    );
    this.meshes = [this.dotMesh];
  }

  update(data: any): void {}
}
