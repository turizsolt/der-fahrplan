import * as BABYLON from 'babylonjs';
import { Passenger } from '../../structs/Interfaces/Passenger';
import { PassengerRenderer } from '../../structs/Renderers/PassengerRenderer';
import { CoordinateToBabylonVector3 } from './converters/CoordinateToBabylonVector3';
import { injectable } from 'inversify';
import { ColorToBabylonColor3 } from './converters/ColorToBabylonColor3';
import { BaseBabylonRenderer } from './BaseBabylonRenderer';

@injectable()
export class PassengerBabylonRenderer extends BaseBabylonRenderer
  implements PassengerRenderer {
  private mesh: BABYLON.Mesh;
  private passenger: Passenger;
  readonly scene: BABYLON.Scene;

  init(passenger: Passenger): void {
    this.passenger = passenger;

    // this.mesh = BABYLON.MeshBuilder.CreateBox(
    //   'box',
    //   { height: 1, width: 1, depth: 1 },
    //   this.scene
    // );
    // this.mesh.position = CoordinateToBabylonVector3(
    //   this.passenger.getPosition()
    // );

    // var boxMaterial = new BABYLON.StandardMaterial('boxMat', this.scene);
    // boxMaterial.diffuseColor = ColorToBabylonColor3(
    //   this.passenger.getTo().getColor()
    // );
    // this.mesh.material = boxMaterial;
    this.update();
  }

  update() {
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
