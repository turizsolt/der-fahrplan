import * as BABYLON from 'babylonjs';
import { CoordinateToBabylonVector3 } from './converters/CoordinateToBabylonVector3';
import { Platform } from '../../structs/Interfaces/Platform';
import { ColorToBabylonColor3 } from './converters/ColorToBabylonColor3';
import { PlatformRenderer } from '../../structs/Renderers/PlatformRenderer';
import { injectable } from 'inversify';
import { BaseBabylonRenderer } from './BaseBabylonRenderer';
import { Color } from '../../structs/Color';

@injectable()
export class PlatformBabylonRenderer extends BaseBabylonRenderer
  implements PlatformRenderer {
  private mesh: BABYLON.Mesh;

  private matNorm: BABYLON.StandardMaterial;
  private matSel: BABYLON.StandardMaterial;
  private platform: Platform;
  private scene: BABYLON.Scene;

  private lastColor: Color;

  init(platform: Platform) {
    this.platform = platform;

    this.mesh = BABYLON.MeshBuilder.CreateBox(
      'clickable-platform-' + this.platform.getId(),
      {
        width: this.platform.getWidth(),
        height: 2.5,
        depth: this.platform.getLength()
      },
      this.scene
    );
    this.mesh.position = CoordinateToBabylonVector3(
      this.platform.getPosition()
    );
    this.mesh.rotation.y = this.platform.getRotation();

    this.lastColor = this.platform.getColor();
    this.matNorm = new BABYLON.StandardMaterial('blue', this.scene);
    this.matNorm.diffuseColor = ColorToBabylonColor3(this.lastColor);
    this.matSel = new BABYLON.StandardMaterial('blue', this.scene);
    this.matSel.diffuseColor = BABYLON.Color3.White();

    this.mesh.material = this.matNorm;
    return this.mesh;
  }

  update(): void {
    if (this.platform.isRemoved()) {
      this.mesh.setEnabled(false);
    } else {
      this.mesh.setEnabled(true);
      if (this.lastColor !== this.platform.getColor()) {
        this.lastColor = this.platform.getColor();
        this.matNorm = new BABYLON.StandardMaterial('blue', this.scene);
        this.matNorm.diffuseColor = ColorToBabylonColor3(this.lastColor);
      }
      this.mesh.material = this.selected ? this.matSel : this.matNorm;
    }
  }

  process(command: string) {
    switch (command) {
      case 'delete':
        this.platform.remove();
        break;
    }
  }
}
