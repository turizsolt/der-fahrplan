import * as BABYLON from 'babylonjs';
import { Engine } from './Engine/Engine';
import { Passenger } from './Passenger/Passenger';
import { Side } from './Side';
import { TrackBase } from './TrackBase/TrackBase';
import { Coordinate } from './Geometry/Coordinate';
import { CoordinateToBabylonVector3 } from './CoordinateToBabylonVector3';

export class Platform {
  private mesh: BABYLON.Mesh;
  position: Coordinate; // todo getter only
  private rotation: number;
  carList: Engine[];
  passengerList: Passenger[] = [];

  private blue: BABYLON.StandardMaterial;
  private red: BABYLON.StandardMaterial;

  constructor(
    readonly no: string,
    readonly track: TrackBase,
    readonly start: number,
    readonly end: number,
    readonly width: number,
    readonly side: Side,
    readonly color: BABYLON.Color3
  ) {
    track.addPlatform(this);

    const segment = this.track.getSegment();
    const a = segment.getFirstPoint();
    const b = segment.getLastPoint();

    var rot = new BABYLON.Vector3(b.x - a.x, 0, b.z - a.z);
    const rot4 = Math.atan2(rot.x, rot.z);
    const rotLeft = rot4 - Math.PI / 2;
    const rotRight = rot4 + Math.PI / 2;

    var center = new BABYLON.Vector3((b.x + a.x) / 2, 0, (b.z + a.z) / 2);

    var dist = 1.6 + width / 2;
    var len = Math.sqrt(
      Math.pow(Math.abs(a.x - b.x), 2) + Math.pow(Math.abs(a.z - b.z), 2)
    );
    var shift = new BABYLON.Vector3(
      Math.sin(side === Side.Left ? rotLeft : rotRight) * 1,
      0,
      Math.cos(side === Side.Left ? rotLeft : rotRight) * 1
    );

    var dist2 = start + (end - start) / 2;
    var shift2 = new BABYLON.Vector3(
      a.x + (rot.x / len) * dist2,
      0,
      a.z + (rot.z / len) * dist2
    );

    var height = new BABYLON.Vector3(0, -0.75, 0);
    this.position = shift2.add(shift.scale(dist)).add(height);
    const rot1 = Math.atan2(rot.x, rot.z);
    this.rotation = rot1;

    this.carList = [];
  }

  render(scene: BABYLON.Scene) {
    this.mesh = BABYLON.MeshBuilder.CreateBox(
      'platform-' + this.no,
      { width: this.width, height: 1.5, depth: this.end - this.start },
      scene
    );
    this.mesh.position = CoordinateToBabylonVector3(this.position);
    this.mesh.rotation.y = this.rotation;

    this.blue = new BABYLON.StandardMaterial('blue', scene);
    this.blue.diffuseColor = this.color;

    this.red = new BABYLON.StandardMaterial('red', scene);
    this.red.diffuseColor = this.color;

    var textureResolution = 100;
    var textureGround = new BABYLON.DynamicTexture(
      this.no,
      { width: 100, height: 50 },
      scene,
      false
    );
    var textureContext = textureGround.getContext();
    var font = 'bold 48px monospace';
    textureGround.drawText(this.no, 5, 45, font, 'black', 'white', true, true);

    this.blue.diffuseTexture = textureGround;

    this.mesh.material = this.blue;
    return this.mesh;
  }

  checkin(engine: Engine) {
    this.carList.push(engine);

    this.mesh.material = this.red;
  }

  checkout(engine: Engine) {
    this.carList = this.carList.filter(elem => elem !== engine);
    if (this.carList.length === 0) {
      this.mesh.material = this.blue;
    }
  }

  isChecked(engine: Engine) {
    return this.carList.filter(elem => elem === engine).length > 0;
  }

  addPassenger(passenger: Passenger) {
    this.passengerList.push(passenger);
  }

  removePassenger(passenger: Passenger) {
    this.passengerList = this.passengerList.filter(x => x !== passenger);
  }

  callForDepartingPassengers(engine: Engine) {
    this.passengerList.map(x => x.checkTrain(engine));
  }
}
