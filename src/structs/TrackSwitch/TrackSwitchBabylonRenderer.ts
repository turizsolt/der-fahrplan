import * as BABYLON from 'babylonjs';
import { TrackSwitchRenderer } from './TrackSwitchRenderer';
import { injectable } from 'inversify';
import { CoordinateToBabylonVector3 } from '../CoordinateToBabylonVector3';
import { TrackSwitch } from './TrackSwitch';
import { curveToTube } from '../Track/TrackBabylonRenderer';
import { Coordinate } from '../Geometry/Coordinate';
import { Bezier } from '../Geometry/Bezier';

@injectable()
export class TrackSwitchBabylonRenderer implements TrackSwitchRenderer {
  private mesh: BABYLON.Mesh;
  private trackSwitch: TrackSwitch;
  readonly scene: BABYLON.Scene;

  init(trackSwitch: TrackSwitch): void {
    this.trackSwitch = trackSwitch;

    const switchBox = BABYLON.MeshBuilder.CreateCylinder(
      'clickable-switchBox-' + this.trackSwitch.getId(),
      {
        diameter: 3,
        tessellation: 24,
        height: 1
      },
      this.scene
    );

    // TODO beutify
    let coord, coord1, coord2: Coordinate;
    let len = 0;
    let len1 = Bezier.getLength(
      this.trackSwitch
        .getSegmentE()
        .getBezier()
        .getCoordinates()
    );
    let len2 = Bezier.getLength(
      this.trackSwitch
        .getSegmentF()
        .getBezier()
        .getCoordinates()
    );
    let shorter = Math.min(len1, len2) - 3;
    do {
      len += 1;
      coord1 = this.trackSwitch
        .getSegmentE()
        .getBezier()
        .getPoint(len / len1);
      coord2 = this.trackSwitch
        .getSegmentF()
        .getBezier()
        .getPoint(len / len2);
      coord = coord1.midpoint(coord2);
    } while (coord1.distance2d(coord2) < 5 && len < shorter);

    switchBox.position = CoordinateToBabylonVector3(coord);

    var boxMaterial = new BABYLON.StandardMaterial('botMat', this.scene);
    boxMaterial.diffuseColor = BABYLON.Color3.Red();
    switchBox.material = boxMaterial;

    const curveE = this.trackSwitch
      .getSegmentE()
      .getCurvePoints()
      .map(CoordinateToBabylonVector3);
    curveToTube(curveE, false);

    const curveF = this.trackSwitch
      .getSegmentF()
      .getCurvePoints()
      .map(CoordinateToBabylonVector3);
    curveToTube(curveF, false);

    const curve = this.trackSwitch
      .getSegment()
      .getCurvePoints()
      .map(CoordinateToBabylonVector3);
    this.mesh = curveToTube(curve);
  }

  update() {
    if (this.mesh) {
      const curve = this.trackSwitch
        .getSegment()
        .getCurvePoints()
        .map(CoordinateToBabylonVector3);

      this.mesh = curveToTube(curve, true, this.mesh);
    }
  }
}
