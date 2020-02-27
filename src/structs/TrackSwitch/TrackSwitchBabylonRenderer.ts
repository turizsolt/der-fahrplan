import * as BABYLON from 'babylonjs';
import { TrackSwitchRenderer } from './TrackSwitchRenderer';
import { injectable } from 'inversify';
import { CoordinateToBabylonVector3 } from '../CoordinateToBabylonVector3';
import { TrackSwitch } from './TrackSwitch';
import { curveToTube } from '../Track/TrackBabylonRenderer';
import { Coordinate } from '../Geometry/Coordinate';
import { Bezier } from '../Geometry/Bezier/Bezier';

@injectable()
export class TrackSwitchBabylonRenderer implements TrackSwitchRenderer {
  private mesh: BABYLON.Mesh;
  private meshE: BABYLON.Mesh;
  private meshF: BABYLON.Mesh;
  private meshSB: BABYLON.Mesh;

  private bal: BABYLON.Mesh;
  private balE: BABYLON.Mesh;
  private balF: BABYLON.Mesh;

  private phE: BABYLON.Mesh;
  private phF: BABYLON.Mesh;

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
    let len1 = this.trackSwitch
      .getSegmentE()
      .getBezier()
      .getLength();

    let len2 = this.trackSwitch
      .getSegmentF()
      .getBezier()
      .getLength();
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
    this.meshSB = switchBox;

    const curveE = this.trackSwitch
      .getSegmentE()
      .getCurvePoints()
      .map(CoordinateToBabylonVector3);
    this.meshE = curveToTube(curveE, false);

    const curveF = this.trackSwitch
      .getSegmentF()
      .getCurvePoints()
      .map(CoordinateToBabylonVector3);
    this.meshF = curveToTube(curveF, false);

    const curve = this.trackSwitch
      .getSegment()
      .getCurvePoints()
      .map(CoordinateToBabylonVector3);
    this.mesh = curveToTube(curve);

    const cAl = this.trackSwitch
      .getSegment()
      .getBezier()
      .getLength();
    const cA = this.trackSwitch
      .getSegment()
      .getBezier()
      .getPoint(4 / cAl);
    this.bal = ballon(cA, this.trackSwitch.getA().getConnectedTrack() ? 1 : 0);

    const cEl = this.trackSwitch
      .getSegmentE()
      .getBezier()
      .getLength();

    const cE = this.trackSwitch
      .getSegmentE()
      .getBezier()
      .getPoint(1 - 4 / cEl);
    this.balE = ballon(cE, this.trackSwitch.getF().getConnectedTrack() ? 1 : 0);

    const cFl = this.trackSwitch
      .getSegmentF()
      .getBezier()
      .getLength();
    const cF = this.trackSwitch
      .getSegmentF()
      .getBezier()
      .getPoint(1 - 4 / cFl);
    this.balF = ballon(cF, this.trackSwitch.getE().getConnectedTrack() ? 1 : 0);

    const pE = this.trackSwitch
      .getSegmentE()
      .getBezier()
      .getPoint(1 - 7 / cEl);
    this.phE = ballon(pE, this.trackSwitch.getF().getConnectedEnd() ? 2 : 0);

    const pF = this.trackSwitch
      .getSegmentF()
      .getBezier()
      .getPoint(1 - 7 / cFl);
    this.phF = ballon(pF, this.trackSwitch.getE().getConnectedEnd() ? 2 : 0);
  }

  update() {
    if (this.mesh) {
      if (this.trackSwitch.isRemoved()) {
        this.mesh.setEnabled(false);
        this.meshE.setEnabled(false);
        this.meshF.setEnabled(false);
        this.meshSB.setEnabled(false);

        this.bal.setEnabled(false);
        this.balE.setEnabled(false);
        this.balF.setEnabled(false);
        this.phE.setEnabled(false);
        this.phF.setEnabled(false);
      } else {
        const curve = this.trackSwitch
          .getSegment()
          .getCurvePoints()
          .map(CoordinateToBabylonVector3);

        this.mesh = curveToTube(curve, true, this.mesh);

        ballonUpdate(
          this.trackSwitch.getA().getConnectedTrack() ? 1 : 0,
          this.bal
        );
        ballonUpdate(
          this.trackSwitch.getF().getConnectedTrack() ? 1 : 0,
          this.balE
        );
        ballonUpdate(
          this.trackSwitch.getE().getConnectedTrack() ? 1 : 0,
          this.balF
        );

        ballonUpdate(
          this.trackSwitch.getF().getConnectedEnd() ? 2 : 0,
          this.phE
        );
        ballonUpdate(
          this.trackSwitch.getE().getConnectedEnd() ? 2 : 0,
          this.phF
        );
      }
    }
  }
}

const colors = [
  BABYLON.Color3.Purple(),
  BABYLON.Color3.Green(),
  BABYLON.Color3.Teal()
];

export const ballon = (coord, color) => {
  const ballon = BABYLON.MeshBuilder.CreateCylinder(
    'ballon',
    {
      diameter: 2,
      tessellation: 24,
      height: 1
    },
    this.scene
  );

  ballon.position = CoordinateToBabylonVector3(coord);

  var boxMaterial = new BABYLON.StandardMaterial('botMat', this.scene);
  boxMaterial.diffuseColor = colors[color];
  ballon.material = boxMaterial;

  return ballon;
};

export const ballonUpdate = (color, mesh) => {
  var boxMaterial = new BABYLON.StandardMaterial('botMat', this.scene);
  boxMaterial.diffuseColor = colors[color];
  mesh.material = boxMaterial;
};
