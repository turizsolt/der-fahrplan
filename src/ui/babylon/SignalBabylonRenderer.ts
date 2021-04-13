import * as BABYLON from 'babylonjs';
import { injectable, inject } from 'inversify';
import { BaseBabylonRenderer } from './BaseBabylonRenderer';
import { SignalRenderer } from '../../structs/Renderers/SignalRenderer';
import { TYPES } from '../../di/TYPES';
import { MeshProvider } from './MeshProvider';
import { Ray } from '../../structs/Geometry/Ray';
import { Left } from '../../structs/Geometry/Directions';
import { MaterialName } from './MaterialName';
import { SignalSignal } from '../../modules/Signaling/SignalSignal';

@injectable()
export class SignalBabylonRenderer extends BaseBabylonRenderer
  implements SignalRenderer {
  @inject(TYPES.FactoryOfMeshProvider)
  private meshProviderFactory: () => MeshProvider;
  private meshProvider: MeshProvider;

  private postMesh: BABYLON.AbstractMesh;
  private redMesh: BABYLON.AbstractMesh;
  private greenMesh: BABYLON.AbstractMesh;

  init(data: any): void {
    this.meshProvider = this.meshProviderFactory();
    const rayPost = Ray.fromData(data.ray).fromHere(Left, 4);
    const rayRed = rayPost.fromHere(0, 0.5);
    const rayGreen = rayPost.fromHere(0, 0.5);
    this.postMesh = this.meshProvider.createSignalMesh(
      rayPost,
      'clickable-signal-' + data.id // + '-post'
    );
    this.redMesh = this.meshProvider.createSignalLight(
      rayRed,
      'clickable-signal-' + data.id // + '-red'
    );
    this.greenMesh = this.meshProvider.createSignalLight(
      rayGreen,
      'clickable-signal-' + data.id // + '-green'
    );
    this.greenMesh.position.y = 1.25;
    this.redMesh.material = this.meshProvider.getMaterial(
      MaterialName.ShuntingRed
    );
    this.greenMesh.material = this.meshProvider.getMaterial(
      MaterialName.RailBlack
    );

    this.meshes = [this.postMesh, this.redMesh, this.greenMesh];
  }

  update(data: any): void {
    this.redMesh.material = this.meshProvider.getMaterial(
      data.signal === SignalSignal.Red
        ? MaterialName.ShuntingRed
        : MaterialName.RailBlack
    );
    this.greenMesh.material = this.meshProvider.getMaterial(
      data.signal === SignalSignal.Green
        ? MaterialName.AllowingGreen
        : MaterialName.RailBlack
    );
  }
}
