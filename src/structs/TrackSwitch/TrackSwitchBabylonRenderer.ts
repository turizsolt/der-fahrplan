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

    const chainE = this.trackSwitch.getSegmentLeft().getLineSegmentChain();
    const chainF = this.trackSwitch.getSegmentRight().getLineSegmentChain();

    const bedSegmentMeshesE = chainE
      .getRayPairs()
      .map(v => this.meshProvider.createBedSegmentMesh(v));

    const bedSegmentMeshesF = chainF
      .getRayPairs()
      .map(v => this.meshProvider.createBedSegmentMesh(v));

    const leftRailMeshes = chainE
      .copyMove(Left, 1)
      .getRayPairs()
      .map(rp => this.meshProvider.createRailSegmentMesh(rp));

    const rightRailMeshes = chainF
      .copyMove(Right, 1)
      .getRayPairs()
      .map(rp => this.meshProvider.createRailSegmentMesh(rp));

    const [peakPoint, peak2] = this.trackSwitch.naturalSplitPoints();

    // todo is the following two mandatory?
    const innerLeftRailMeshes = chainE
      .copyMove(Right, 1)
      .getRayPairsFromPoint(peakPoint.coord)
      .map(rp => this.meshProvider.createRailSegmentMesh(rp));

    const innerRightRailMeshes = chainF
      .copyMove(Left, 1)
      .getRayPairsFromPoint(peakPoint.coord)
      .map(rp => this.meshProvider.createRailSegmentMesh(rp));

    const maxRad1 = this.trackSwitch
      .getSegmentE()
      .getFirstPoint()
      .distance2d(peakPoint.coord);

    const maxRad2 = this.trackSwitch
      .getSegmentE()
      .getFirstPoint()
      .distance2d(peak2.coord);

    const maxRad = (maxRad1 + maxRad2) / 2;

    const sleeperPointsE = chainE.getRadiallySpacedRays(
      maxRad,
      maxRad / Math.floor(maxRad)
    );

    const sleeperPointsF = chainF.getRadiallySpacedRays(
      maxRad,
      maxRad / Math.floor(maxRad)
    );

    if (sleeperPointsE.length === sleeperPointsF.length) {
      const sleeperMeshesTogether = zip(sleeperPointsE, sleeperPointsF).map(
        ([a, b]) => this.meshProvider.createSwitchSleeperMesh(a, b)
      );

      const lastE = sleeperPointsE.slice(-1)[0];
      const lastF = sleeperPointsF.slice(-1)[0];

      const shortChainE = chainE.getChainFromPoint(lastE.coord);
      const lenE = shortChainE.getLength();
      const shortChainF = chainF.getChainFromPoint(lastF.coord);
      const lenF = shortChainF.getLength();

      const magic = x => {
        return x / (Math.round((x + 1) / 2) * 2 - 1);
      };

      const sleeperMeshesE = shortChainE
        .getEvenlySpacedRays(magic(lenE), true)
        .map(v => this.meshProvider.createSleeperMesh(v));

      const sleeperMeshesF = shortChainF
        .getEvenlySpacedRays(magic(lenF), true)
        .map(v => this.meshProvider.createSleeperMesh(v));

      this.meshes = [
        ...bedSegmentMeshesE,
        ...bedSegmentMeshesF,
        ...leftRailMeshes,
        ...rightRailMeshes,
        ...innerLeftRailMeshes,
        ...innerRightRailMeshes,
        ...sleeperMeshesTogether,
        ...sleeperMeshesE,
        ...sleeperMeshesF
      ];
    } else {
      sleeperPointsE.map(x => ballon(x.setY(1.2).coord, BABYLON.Color3.White));
      sleeperPointsF.map(x => ballon(x.setY(1.2).coord, BABYLON.Color3.White));
    }

    const [peak] = this.trackSwitch.naturalSplitPoints();
    ballon(peak.setY(1.2).coord, BABYLON.Color3.White);
    ballon(peak2.setY(1.2).coord, BABYLON.Color3.White);
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
      diameter: 0.4,
      tessellation: 6,
      height: 1
    },
    null
  );
  ballon.position = CoordinateToBabylonVector3(coord);
  return ballon;
};

function zip(arr1, arr2) {
  return arr1.map((k, i) => [k, arr2[i]]);
}
