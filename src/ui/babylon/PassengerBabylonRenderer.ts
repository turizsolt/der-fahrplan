import * as BABYLON from 'babylonjs';
import { Passenger } from '../../structs/Interfaces/Passenger';
import { PassengerRenderer } from '../../structs/Renderers/PassengerRenderer';
import { CoordinateToBabylonVector3 } from './converters/CoordinateToBabylonVector3';
import { injectable } from 'inversify';
import { ColorToBabylonColor3 } from './converters/ColorToBabylonColor3';
import { BaseBabylonRenderer } from './BaseBabylonRenderer';
import { Color } from '../../structs/Color';

@injectable()
export class PassengerBabylonRenderer extends BaseBabylonRenderer
  implements PassengerRenderer {
  private mesh: BABYLON.Mesh;
  private passenger: Passenger;
  readonly scene: BABYLON.Scene;

  init(passenger: Passenger): void {
    this.passenger = passenger;

    this.mesh = BABYLON.MeshBuilder.CreateSphere(
      'box',
      { diameter: 1 }, //{ height: 1, width: 1, depth: 1 },
      this.scene
    );

    var boxMaterial = new BABYLON.StandardMaterial('boxMat', this.scene);
    boxMaterial.diffuseColor = ColorToBabylonColor3(this.passenger.getColor());
    this.mesh.material = boxMaterial;
    this.update();
  }

  update() {
    if (!this.passenger.getPlace()) {
      this.mesh.setEnabled(false);
    } else {
      this.mesh.setEnabled(true);

      this.mesh.position = CoordinateToBabylonVector3(
        this.passenger.getPosition()
      );
      this.mesh.position.y =
        this.passenger.getPlace().getType() === Symbol.for('Platform')
          ? 2
          : this.passenger.getPlace().getType() === Symbol.for('Wagon')
          ? 6
          : 12;
      console.log(
        `pass #${this.passenger.getId()} on ${this.passenger.getPlace() &&
          this.passenger
            .getPlace()
            .getType()
            .toString()} #${this.passenger.getPlace() &&
          this.passenger.getPlace().getId()}`
      );
    }
  }
}
