import * as BABYLON from 'babylonjs';
import { injectable, inject } from 'inversify';
import { BaseBabylonRenderer } from './BaseBabylonRenderer';
import { SignalRenderer } from '../../structs/Renderers/SignalRenderer';
import { TYPES } from '../../di/TYPES';
import { MeshProvider } from './MeshProvider';
import { Ray } from '../../structs/Geometry/Ray';
import { Right } from '../../structs/Geometry/Directions';
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
    return;

    this.meshProvider = this.meshProviderFactory();
    const rayPost = Ray.fromData(data.ray).fromHere(Right, 4);
    const rayRed = rayPost.fromHere(0, -0.5);
    const rayGreen = rayPost.fromHere(0, -0.5);
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

    this.meshes = [this.postMesh, this.redMesh, this.greenMesh];
    this.update(data);
  }

  update(data: any): void {
    return;

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
    this.postMesh.material = this.meshProvider.getMaterial(
      data.hidden ? MaterialName.BedGray : MaterialName.RailBlack
    );
  }
}
