import * as BABYLON from 'babylonjs';
import { TrackSwitchRenderer } from './TrackSwitchRenderer';
import { injectable } from 'inversify';
import { CoordinateToBabylonVector3 } from '../CoordinateToBabylonVector3';
import { TrackSwitch } from './TrackSwitch';

@injectable()
export class TrackSwitchBabylonRenderer implements TrackSwitchRenderer {
  private mesh: BABYLON.LinesMesh;
  private trackSwitch: TrackSwitch;
  readonly scene: BABYLON.Scene;

  init(trackSwitch: TrackSwitch): void {
    this.trackSwitch = trackSwitch;

    const switchBox = BABYLON.MeshBuilder.CreateBox(
      'switchBox-' + this.trackSwitch.id,
      { height: 3, width: 3, depth: 3 },
      this.scene
    );
    switchBox.position = CoordinateToBabylonVector3(this.trackSwitch.A.point);
    switchBox.position.y = 10;

    var boxMaterial = new BABYLON.StandardMaterial('botMat', this.scene);
    boxMaterial.diffuseColor = BABYLON.Color3.Red();
    switchBox.material = boxMaterial;

    const track1 = BABYLON.MeshBuilder.CreateDashedLines(
      'track',
      {
        points: this.trackSwitch.segmentE.curvePoints.map(
          CoordinateToBabylonVector3
        ),
        gapSize: 5,
        dashSize: 1
      },
      this.scene
    );
    track1.color = new BABYLON.Color3(0, 0, 0);

    const track2 = BABYLON.MeshBuilder.CreateDashedLines(
      'track',
      {
        points: this.trackSwitch.segmentF.curvePoints.map(
          CoordinateToBabylonVector3
        ),
        gapSize: 5,
        dashSize: 1
      },
      this.scene
    );
    track2.color = new BABYLON.Color3(0, 0, 0);

    const track = BABYLON.Mesh.CreateLines(
      'lines',
      this.trackSwitch.segment.curvePoints.map(CoordinateToBabylonVector3),
      this.scene,
      true
    );
    track.color = new BABYLON.Color3(0, 0, 0);
    this.mesh = track;
  }

  update() {
    if (this.mesh)
      this.mesh = BABYLON.Mesh.CreateLines(
        null,
        this.trackSwitch.segment.curvePoints.map(CoordinateToBabylonVector3),
        null,
        null,
        this.mesh
      );
  }
}
