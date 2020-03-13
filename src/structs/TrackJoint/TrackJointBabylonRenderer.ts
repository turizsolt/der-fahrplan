import * as BABYLON from 'babylonjs';
import { TrackJoint } from './TrackJoint';
import { TrackJointRenderer } from './TrackJointRenderer';
import { injectable, inject } from 'inversify';
import { BaseBabylonRenderer } from '../Base/BaseBabylonRenderer';
import { MeshProvider } from '../../babylon/MeshProvider';
import { TYPES } from '../TYPES';
import { MaterialName } from '../../babylon/MaterialName';

@injectable()
export class TrackJointBabylonRenderer extends BaseBabylonRenderer
  implements TrackJointRenderer {
  private mesh: BABYLON.AbstractMesh;
  private trackJoint: TrackJoint;
  readonly scene: BABYLON.Scene;

  @inject(TYPES.FactoryOfMeshProvider)
  private meshProviderFactory: () => MeshProvider;
  private meshProvider: MeshProvider;

  init(trackJoint: TrackJoint): void {
    this.trackJoint = trackJoint;
    this.meshProvider = this.meshProviderFactory();

    this.mesh = this.meshProvider.createSleeperJointMesh(
      this.trackJoint.getRay(),
      'clickable-trackJoint-' + this.trackJoint.getId()
    );
    this.meshes = [this.mesh];
    this.update();
  }

  update() {
    this.mesh.material = this.selected
      ? this.meshProvider.getMaterial(MaterialName.SelectorRed)
      : this.meshProvider.getMaterial(MaterialName.RailBlack);
  }

  process(command: string): void {
    switch (command) {
      case 'delete':
        this.trackJoint.remove();
        break;
    }
  }
}
