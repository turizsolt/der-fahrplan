import * as BABYLON from 'babylonjs';
import { injectable, inject } from 'inversify';
import { BaseBabylonRenderer } from './BaseBabylonRenderer';
import { TYPES } from '../../di/TYPES';
import { MeshProvider } from './MeshProvider';
import { MaterialName } from './MaterialName';
import { StationRenderer } from '../../structs/Renderers/StationRenderer';
import { Station } from '../../structs/Scheduling/Station';
import { CoordinateToBabylonVector3 } from './converters/CoordinateToBabylonVector3';
import { ColorToBabylonColor3 } from './converters/ColorToBabylonColor3';

@injectable()
export class StationBabylonRenderer extends BaseBabylonRenderer
  implements StationRenderer {
  private station: Station;
  @inject(TYPES.FactoryOfMeshProvider)
  private meshProviderFactory: () => MeshProvider;
  private meshProvider: MeshProvider;
  private selectableMeshes: BABYLON.AbstractMesh[];
  private myMat: BABYLON.StandardMaterial;

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

    this.myMat = new BABYLON.StandardMaterial('randomColor', null);
    this.myMat.diffuseColor = ColorToBabylonColor3(this.station.getColor());
    mesh.material = this.myMat;

    this.update();
  }

  private lastSelected: boolean = false;

  update() {
    if (this.station.isRemoved()) {
      this.meshes.map(mesh => mesh.setEnabled(false));
    } else {
      this.meshes[0].position = CoordinateToBabylonVector3(
        this.station.getCircle().a
      );
      this.meshes[0].position.y = 0.05;

      if (this.selected && !this.lastSelected) {
        this.selectableMeshes.map(
          x =>
          (x.material = this.meshProvider.getMaterial(
            MaterialName.SelectorRed
          ))
        );
      } else if (!this.selected && this.lastSelected) {
        this.selectableMeshes.map(x => (x.material = this.myMat));
      }

      this.lastSelected = this.selected;
    }
  }

  process(command: string) {
    switch (command) {
      case 'delete':
        this.station.remove();
        break;
    }
  }
}
