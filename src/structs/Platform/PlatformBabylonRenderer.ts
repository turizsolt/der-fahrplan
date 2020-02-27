import * as BABYLON from 'babylonjs';
import { CoordinateToBabylonVector3 } from '../CoordinateToBabylonVector3';
import { Platform } from './Platform';
import { ColorToBabylonColor3 } from '../ColorToBabylonColor3';
import { PlatformRenderer } from './PlatformRenderer';
import { injectable } from 'inversify';

@injectable()
export class PlatformBabylonRenderer implements PlatformRenderer {
  private mesh: BABYLON.Mesh;

  private blue: BABYLON.StandardMaterial;
  private platform: Platform;
  private scene: BABYLON.Scene;

  init(platform: Platform) {
    this.platform = platform;

    this.mesh = BABYLON.MeshBuilder.CreateBox(
      'platform-' + this.platform.getId(),
      {
        width: this.platform.getWidth(),
        height: 1.5,
        depth: this.platform.getLength()
      },
      this.scene
    );
    this.mesh.position = CoordinateToBabylonVector3(
      this.platform.getPosition()
    );
    this.mesh.rotation.y = this.platform.getRotation();

    this.blue = new BABYLON.StandardMaterial('blue', this.scene);
    this.blue.diffuseColor = ColorToBabylonColor3(this.platform.getColor());

    this.mesh.material = this.blue;
    return this.mesh;
  }
}
