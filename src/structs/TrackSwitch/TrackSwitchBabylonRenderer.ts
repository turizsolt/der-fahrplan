import * as BABYLON from 'babylonjs';
import { TrackSwitchRenderer } from './TrackSwitchRenderer';
import { injectable, inject } from 'inversify';
import { TrackSwitch } from './TrackSwitch';
import { BaseBabylonRenderer } from '../Base/BaseBabylonRenderer';
import { TYPES } from '../TYPES';
import { MeshProvider } from '../../babylon/MeshProvider';
import { Left, Right } from '../Geometry/Directions';
import { CoordinateToBabylonVector3 } from '../CoordinateToBabylonVector3';

@injectable()
export class TrackSwitchBabylonRenderer extends BaseBabylonRenderer
  implements TrackSwitchRenderer {
  private trackSwitch: TrackSwitch;
  @inject(TYPES.FactoryOfMeshProvider)
  private meshProviderFactory: () => MeshProvider;
  private meshProvider: MeshProvider;

  init(trackSwitch: TrackSwitch): void {
    this.trackSwitch = trackSwitch;
    this.meshProvider = this.meshProviderFactory();

    const bezierE = this.trackSwitch.getSegmentE().getBezier();
    const lenE = this.trackSwitch.getSegmentE().getLength();

    const bedSegmentMeshesE = bezierE
      .getLinePairRays()
      .map(v => this.meshProvider.createBedSegmentMesh(v));

    const sleeperMeshesE = bezierE
      .getLineOffRays(lenE / Math.floor(lenE))
      .map(v => this.meshProvider.createSleeperMesh(v));

    const leftRailMeshesE = bezierE
      .getLinePairRays()
      .map(seg =>
        this.meshProvider.createRailSegmentMesh([
          seg.a.fromHere(Left, 1),
          seg.b.fromHere(Left, 1)
        ])
      );

    const rightRailMeshesE = bezierE
      .getLinePairRays()
      .map(seg =>
        this.meshProvider.createRailSegmentMesh([
          seg.a.fromHere(Right, 1),
          seg.b.fromHere(Right, 1)
        ])
      );

    ////////////

    const bezier = this.trackSwitch.getSegmentF().getBezier();
    const len = this.trackSwitch.getSegmentF().getLength();

    const bedSegmentMeshes = bezier
      .getLinePairRays()
      .map(v => this.meshProvider.createBedSegmentMesh(v));

    const sleeperMeshes = bezier
      .getLineOffRays(len / Math.floor(len))
      .map(v => this.meshProvider.createSleeperMesh(v));

    const leftRailMeshes = bezier
      .getLinePairRays()
      .map(seg =>
        this.meshProvider.createRailSegmentMesh([
          seg.a.fromHere(Left, 1),
          seg.b.fromHere(Left, 1)
        ])
      );

    const rightRailMeshes = bezier
      .getLinePairRays()
      .map(seg =>
        this.meshProvider.createRailSegmentMesh([
          seg.a.fromHere(Right, 1),
          seg.b.fromHere(Right, 1)
        ])
      );

    ////////////////

    const r = this.trackSwitch.naturalSplitPoints();
    r.map(p => ballon(p.setY(2).coord, BABYLON.Color3.Red));

    this.meshes = [
      ...bedSegmentMeshesE,
      ...sleeperMeshesE,
      ...leftRailMeshesE,
      ...rightRailMeshesE,
      ///
      ...bedSegmentMeshes,
      ...sleeperMeshes,
      ...leftRailMeshes,
      ...rightRailMeshes
    ];
  }

  update() {}

  process(command: string) {
    switch (command) {
      case 'switch':
        this.trackSwitch.switch();
        break;

      case 'delete':
        this.trackSwitch.remove();
        break;
    }
  }
}

export const ballon = (coord, color) => {
  const ballon = BABYLON.MeshBuilder.CreateCylinder(
    'ballon',
    {
      diameter: 2,
      tessellation: 6,
      height: 1
    },
    null
  );
  ballon.position = CoordinateToBabylonVector3(coord);
  return ballon;
};
