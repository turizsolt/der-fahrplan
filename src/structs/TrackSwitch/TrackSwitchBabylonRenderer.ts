import * as BABYLON from 'babylonjs';
import { TrackSwitchRenderer } from './TrackSwitchRenderer';
import { injectable, inject } from 'inversify';
import { TrackSwitch } from './TrackSwitch';
import { BaseBabylonRenderer } from '../Base/BaseBabylonRenderer';
import { TYPES } from '../TYPES';
import { MeshProvider } from '../../babylon/MeshProvider';
import { Left, Right } from '../Geometry/Directions';
import { CoordinateToBabylonVector3 } from '../CoordinateToBabylonVector3';
import { MaterialName } from '../../babylon/MaterialName';

@injectable()
export class TrackSwitchBabylonRenderer extends BaseBabylonRenderer
  implements TrackSwitchRenderer {
  private trackSwitch: TrackSwitch;
  @inject(TYPES.FactoryOfMeshProvider)
  private meshProviderFactory: () => MeshProvider;
  private meshProvider: MeshProvider;
  private selectableMeshes: BABYLON.AbstractMesh[];
  private leftMeshes: BABYLON.AbstractMesh[];
  private rightMeshes: BABYLON.AbstractMesh[];
  private left: number;
  private right: number;

  init(trackSwitch: TrackSwitch): void {
    this.trackSwitch = trackSwitch;
    this.meshProvider = this.meshProviderFactory();

    const chainE = this.trackSwitch.getSegmentLeft().getLineSegmentChain();
    const chainF = this.trackSwitch.getSegmentRight().getLineSegmentChain();

    const name = 'clickable-track-' + this.trackSwitch.getId();

    if (this.trackSwitch.getSegmentE() === this.trackSwitch.getSegmentLeft()) {
      this.left = 1;
      this.right = 0;
    } else {
      this.left = 0;
      this.right = 1;
    }

    const bedSegmentMeshesE = chainE
      .getRayPairs()
      .map(v => this.meshProvider.createBedSegmentMesh(v, name));

    const bedSegmentMeshesF = chainF
      .getRayPairs()
      .map(v => this.meshProvider.createBedSegmentMesh(v, name));

    const leftRailMeshes = chainE
      .copyMove(Left, 1)
      .getRayPairs()
      .map(rp => this.meshProvider.createRailSegmentMesh(rp, name));

    const rightRailMeshes = chainF
      .copyMove(Right, 1)
      .getRayPairs()
      .map(rp => this.meshProvider.createRailSegmentMesh(rp, name));

    const [peakPoint, peak2] = this.trackSwitch.naturalSplitPoints();

    // todo is the following two mandatory?
    const innerLeftRailMeshes = chainE
      .copyMove(Right, 1)
      .getRayPairsFromPoint(peakPoint.coord)
      .map(rp => this.meshProvider.createRailSegmentMesh(rp, name));

    const innerRightRailMeshes = chainF
      .copyMove(Left, 1)
      .getRayPairsFromPoint(peakPoint.coord)
      .map(rp => this.meshProvider.createRailSegmentMesh(rp, name));

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

    const sleeperMeshesTogether = zip(sleeperPointsE, sleeperPointsF).map(
      ([a, b]) => this.meshProvider.createSwitchSleeperMesh(a, b, name)
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
      .map(v => this.meshProvider.createSleeperMesh(v, name));

    const sleeperMeshesF = shortChainF
      .getEvenlySpacedRays(magic(lenF), true)
      .map(v => this.meshProvider.createSleeperMesh(v, name));

    this.leftMeshes = chainE
      .copyMove(Right, 1)
      .getRayPairsToPoint(peakPoint.coord)
      .map(rp => this.meshProvider.createRailSegmentMesh(rp, name));

    this.rightMeshes = chainF
      .copyMove(Left, 1)
      .getRayPairsToPoint(peakPoint.coord)
      .map(rp => this.meshProvider.createRailSegmentMesh(rp, name));

    const ballonMesh = ballon(peak2.setY(1.2).coord, BABYLON.Color3.White);

    this.meshes = [
      ...bedSegmentMeshesE,
      ...bedSegmentMeshesF,
      ...leftRailMeshes,
      ...rightRailMeshes,
      ...innerLeftRailMeshes,
      ...innerRightRailMeshes,
      ...sleeperMeshesTogether,
      ...sleeperMeshesE,
      ...sleeperMeshesF,
      ...this.leftMeshes,
      ...this.rightMeshes,
      ballonMesh
    ];

    this.selectableMeshes = [
      ...sleeperMeshesTogether,
      ...sleeperMeshesE,
      ...sleeperMeshesF
    ];

    //   sleeperPointsE.map(x => ballon(x.setY(1.2).coord, BABYLON.Color3.White));
    //   sleeperPointsF.map(x => ballon(x.setY(1.2).coord, BABYLON.Color3.White));
  }

  private lastSelected: boolean = false;

  update() {
    if (!this.trackSwitch.isEmpty()) {
      this.selectableMeshes.map(
        x => (x.material = this.meshProvider.getMaterial(MaterialName.BedGray))
      );
    } else {
      if (this.selected && !this.lastSelected) {
        this.selectableMeshes.map(
          x =>
            (x.material = this.meshProvider.getMaterial(
              MaterialName.SelectorRed
            ))
        );
      } else if (!this.selected && this.lastSelected) {
        this.selectableMeshes.map(
          x =>
            (x.material = this.meshProvider.getMaterial(
              MaterialName.SleeperBrown
            ))
        );
      } else {
        this.selectableMeshes.map(
          x =>
            (x.material = this.meshProvider.getMaterial(
              MaterialName.SleeperBrown
            ))
        );
      }
    }

    this.lastSelected = this.selected;

    const state = this.trackSwitch.getState();
    this.leftMeshes.map(x => x.setEnabled(state === this.left));
    this.rightMeshes.map(x => x.setEnabled(state === this.right));
  }

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
