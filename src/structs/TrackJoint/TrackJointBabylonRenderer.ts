import * as BABYLON from 'babylonjs';
import { TrackJoint } from './TrackJoint';
import { TrackJointRenderer } from './TrackJointRenderer';
import { CoordinateToBabylonVector3 } from '../CoordinateToBabylonVector3';
import { injectable } from 'inversify';
import { BaseBabylonRenderer } from '../Base/BaseBabylonRenderer';

@injectable()
export class TrackJointBabylonRenderer extends BaseBabylonRenderer
  implements TrackJointRenderer {
  private mesh: BABYLON.Mesh;
  private trackJoint: TrackJoint;
  readonly scene: BABYLON.Scene;
  private arrowMaterial: BABYLON.StandardMaterial;
  private redArrowMaterial: BABYLON.StandardMaterial;

  init(trackJoint: TrackJoint): void {
    this.trackJoint = trackJoint;

    this.mesh = BABYLON.MeshBuilder.CreateCylinder(
      'clickable-trackJoint-' + this.trackJoint.getId(),
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
    this.arrowMaterial = new BABYLON.StandardMaterial('arrow', this.scene);
    this.arrowMaterial.diffuseTexture = new BABYLON.Texture(
      'assets/arrow.png',
      this.scene
    );
    this.redArrowMaterial = new BABYLON.StandardMaterial(
      'redArrow',
      this.scene
    );
    this.redArrowMaterial.diffuseTexture = new BABYLON.Texture(
      'assets/red_arrow.png',
      this.scene
    );
    this.update();
  }

  update() {
    if (!this.trackJoint.isRemoved()) {
      this.mesh.material = this.selected
        ? this.redArrowMaterial
        : this.arrowMaterial;
      this.mesh.position = CoordinateToBabylonVector3(
        this.trackJoint.getPosition()
      );
      this.mesh.position.y = 0.5;
      this.mesh.rotation.y = this.trackJoint.getRotation();
    } else {
      this.mesh.setEnabled(false);
    }
  }

  process(command: string): void {
    switch (command) {
      case 'delete':
        this.trackJoint.remove();
        break;
    }
  }
}
