import * as BABYLON from 'babylonjs';
import { TrackRenderer } from '../../structs/Renderers/TrackRenderer';
import { injectable, inject } from 'inversify';
import { Track } from '../../structs/Interfaces/Track';
import { BaseBabylonRenderer } from './BaseBabylonRenderer';
import { Left, Right } from '../../structs/Geometry/Directions';
import { TYPES } from '../../structs/TYPES';
import { MeshProvider } from './MeshProvider';
import { MaterialName } from './MaterialName';
import { StationRenderer } from '../../structs/Renderers/StationRenderer';
import { Station } from '../../structs/Scheduling/Station';
import { CoordinateToBabylonVector3 } from './converters/CoordinateToBabylonVector3';

@injectable()
export class StationBabylonRenderer extends BaseBabylonRenderer
  implements StationRenderer {
  private station: Station;
  @inject(TYPES.FactoryOfMeshProvider)
  private meshProviderFactory: () => MeshProvider;
  private meshProvider: MeshProvider;
  private selectableMeshes: BABYLON.AbstractMesh[];

  init(station: Station): void {
    this.station = station;
    this.meshProvider = this.meshProviderFactory();

    const name = 'clickable-station-' + this.station.getId();

    const mesh = this.meshProvider.createStationMesh(
      name,
      this.station.getCircle().r
    );

    this.meshes = [mesh];
    this.selectableMeshes = [mesh];

    this.update();
  }

  update() {
    this.meshes[0].position = CoordinateToBabylonVector3(
      this.station.getCircle().a
    );
    this.meshes[0].position.y = 0.05;
  }

  process(command: string) {
    switch (command) {
      case 'delete':
        //this.station.remove();
        break;
    }
  }
}
