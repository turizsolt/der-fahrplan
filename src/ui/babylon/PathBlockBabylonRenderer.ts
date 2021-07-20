import * as BABYLON from 'babylonjs';
import { injectable, inject } from 'inversify';
import { BaseBabylonRenderer } from './BaseBabylonRenderer';
import { TYPES } from '../../di/TYPES';
import { MeshProvider } from './MeshProvider';
import { PathBlockRenderer } from '../../structs/Renderers/PathBlockRenderer';
import { CoordinateToBabylonVector3 } from './converters/CoordinateToBabylonVector3';

@injectable()
export class PathBlockBabylonRenderer extends BaseBabylonRenderer
  implements PathBlockRenderer {
  @inject(TYPES.FactoryOfMeshProvider)
  private meshProviderFactory: () => MeshProvider;
  private meshProvider: MeshProvider;
  private button: BABYLON.AbstractMesh;

  init(data: any): void {
    return;

    this.meshProvider = this.meshProviderFactory();
    this.button = this.meshProvider.createPathBlockMesh(
      'clickable-pathBlock-' + data.id
    );
    this.button.position = CoordinateToBabylonVector3(data.coord);
    this.button.position.y = 5;

    this.meshes = [this.button];
  }

  update(data: any): void { }
}
