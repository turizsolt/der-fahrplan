import * as BABYLON from 'babylonjs';
import { injectable, inject } from 'inversify';
import { BaseBabylonRenderer } from './BaseBabylonRenderer';
import { TYPES } from '../../di/TYPES';
import { MeshProvider } from './MeshProvider';
import { SectionRenderer } from '../../structs/Renderers/SectionRenderer';

@injectable()
export class SectionBabylonRenderer extends BaseBabylonRenderer
  implements SectionRenderer {
  @inject(TYPES.FactoryOfMeshProvider)
  private meshProviderFactory: () => MeshProvider;
  private meshProvider: MeshProvider;

  init(data: any): void {
    this.meshProvider = this.meshProviderFactory();
    this.meshes = [];
  }

  update(data: any): void {}
}
