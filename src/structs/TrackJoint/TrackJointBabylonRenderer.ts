import * as BABYLON from 'babylonjs';
import { TrackJoint } from './TrackJoint';
import { TrackJointRenderer } from './TrackJointRenderer';
import { CoordinateToBabylonVector3 } from '../CoordinateToBabylonVector3';
import { injectable } from 'inversify';

@injectable()
export class TrackJointBabylonRenderer implements TrackJointRenderer {
  private mesh: BABYLON.Mesh;
  private trackJoint: TrackJoint;
  readonly scene: BABYLON.Scene;

  init(trackJoint: TrackJoint): void {
    //return;
    this.trackJoint = trackJoint;

    this.mesh = BABYLON.MeshBuilder.CreateCylinder(
      'm-' + this.trackJoint.id,
      {
        diameter: 5,
        tessellation: 24,
        height: 1,
        faceUV: [
          new BABYLON.Vector4(0, 0, 1, 1),
          new BABYLON.Vector4(1, 1, 1, 1)
        ],
        updatable: true
      },
      this.scene
    );
    const arrowMaterial = new BABYLON.StandardMaterial('arrow', this.scene);
    arrowMaterial.diffuseTexture = new BABYLON.Texture(
      'assets/arrow.png',
      this.scene
    );
    this.mesh.material = arrowMaterial;
    this.update();
  }

  update() {
    //return;
    if (!this.trackJoint.removed) {
      this.mesh.position = CoordinateToBabylonVector3(this.trackJoint.position);
      this.mesh.position.y = -0.5;
      this.mesh.rotation.y = this.trackJoint.rotation;
    } else {
      this.mesh.setEnabled(false);
    }
  }
}
