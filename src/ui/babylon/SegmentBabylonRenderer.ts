import * as BABYLON from 'babylonjs';
import { injectable, inject } from 'inversify';
import { BaseBabylonRenderer } from './BaseBabylonRenderer';
import { TYPES } from '../../di/TYPES';
import { MeshProvider } from './MeshProvider';
import { SegmentRenderer } from '../../structs/Renderers/SegmentRenderer';

@injectable()
export class SegmentBabylonRenderer extends BaseBabylonRenderer
  implements SegmentRenderer {
  @inject(TYPES.FactoryOfMeshProvider)
  private meshProviderFactory: () => MeshProvider;
  private meshProvider: MeshProvider;

  init(data: any): void {
    this.meshProvider = this.meshProviderFactory();
    this.meshes = [];
  }

  update(data: any): void {}
}
