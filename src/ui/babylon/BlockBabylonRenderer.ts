import * as BABYLON from 'babylonjs';
import { injectable, inject } from 'inversify';
import { BaseBabylonRenderer } from './BaseBabylonRenderer';
import { TYPES } from '../../di/TYPES';
import { MeshProvider } from './MeshProvider';
import { BlockRenderer } from '../../structs/Renderers/BlockRenderer';

@injectable()
export class BlockBabylonRenderer extends BaseBabylonRenderer
  implements BlockRenderer {
  @inject(TYPES.FactoryOfMeshProvider)
  private meshProviderFactory: () => MeshProvider;
  private meshProvider: MeshProvider;

  init(data: any): void {
    this.meshProvider = this.meshProviderFactory();
    this.meshes = [];
  }

  update(data: any): void {}
}
