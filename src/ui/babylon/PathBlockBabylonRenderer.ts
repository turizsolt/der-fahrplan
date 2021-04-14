import * as BABYLON from 'babylonjs';
import { injectable, inject } from 'inversify';
import { BaseBabylonRenderer } from './BaseBabylonRenderer';
import { TYPES } from '../../di/TYPES';
import { MeshProvider } from './MeshProvider';
import { PathBlockRenderer } from '../../structs/Renderers/PathBlockRenderer';

@injectable()
export class PathBlockBabylonRenderer extends BaseBabylonRenderer
  implements PathBlockRenderer {
  @inject(TYPES.FactoryOfMeshProvider)
  private meshProviderFactory: () => MeshProvider;
  private meshProvider: MeshProvider;

  init(data: any): void {
    this.meshProvider = this.meshProviderFactory();
    this.meshes = [];
  }

  update(data: any): void {}
}
