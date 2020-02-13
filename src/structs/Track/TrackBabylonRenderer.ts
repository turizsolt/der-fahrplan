import * as BABYLON from 'babylonjs';
import { TrackRenderer } from './TrackRenderer';
import { injectable } from 'inversify';
import { Track } from './Track';
import { CoordinateToBabylonVector3 } from '../CoordinateToBabylonVector3';

@injectable()
export class TrackBabylonRenderer implements TrackRenderer {
  private mesh: BABYLON.LinesMesh;
  private track: Track;
  readonly scene: BABYLON.Scene;

  init(track: Track): void {
    this.track = track;

    this.mesh = BABYLON.MeshBuilder.CreateLines(
      'track',
      {
        points: this.track
          .getSegment()
          .getCurvePoints()
          .map(CoordinateToBabylonVector3)
      },
      this.scene
    );
    this.mesh.color = new BABYLON.Color3(0, 0, 0);
  }

  update() {}
}
