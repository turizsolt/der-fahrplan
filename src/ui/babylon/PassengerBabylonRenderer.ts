import * as BABYLON from 'babylonjs';
import { Passenger } from '../../structs/Actuals/Passenger';
import { PassengerRenderer } from '../../structs/Renderers/PassengerRenderer';
import { CoordinateToBabylonVector3 } from './converters/CoordinateToBabylonVector3';
import { injectable } from 'inversify';
import { ColorToBabylonColor3 } from './converters/ColorToBabylonColor3';

@injectable()
export class PassengerBabylonRenderer implements PassengerRenderer {
  private mesh: BABYLON.Mesh;
  private passenger: Passenger;
  readonly scene: BABYLON.Scene;

  init(passenger: Passenger): void {
    this.passenger = passenger;

    this.mesh = BABYLON.MeshBuilder.CreateBox(
      'box',
      { height: 1, width: 1, depth: 1 },
      this.scene
    );
    this.mesh.position = CoordinateToBabylonVector3(this.passenger.position);

    var boxMaterial = new BABYLON.StandardMaterial('boxMat', this.scene);
    boxMaterial.diffuseColor = ColorToBabylonColor3(
      this.passenger.to.getColor()
    );
    this.mesh.material = boxMaterial;
  }

  update() {
    if (this.passenger.onPlatform || this.passenger.onEngine) {
      this.mesh.position = CoordinateToBabylonVector3(this.passenger.position);
    } else {
      this.mesh.setEnabled(false);
    }
  }
}
