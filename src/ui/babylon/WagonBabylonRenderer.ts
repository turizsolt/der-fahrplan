import * as BABYLON from 'babylonjs';
import { CoordinateToBabylonVector3 } from './converters/CoordinateToBabylonVector3';
import { injectable, inject } from 'inversify';
import { BaseBabylonRenderer } from './BaseBabylonRenderer';
import { MeshProvider } from './MeshProvider';
import { TYPES } from '../../di/TYPES';
import { WagonRenderer } from '../../structs/Renderers/WagonRenderer';
import { Wagon } from '../../structs/Interfaces/Wagon';
import { MaterialName } from './MaterialName';

@injectable()
export class WagonBabylonRenderer extends BaseBabylonRenderer
  implements WagonRenderer {
  private mesh: BABYLON.AbstractMesh;
  private selectedMesh: BABYLON.AbstractMesh;
  private wagon: Wagon;
  readonly scene: BABYLON.Scene;

  private endAMesh: BABYLON.AbstractMesh;
  private endBMesh: BABYLON.AbstractMesh;

  @inject(TYPES.FactoryOfMeshProvider)
  private meshProviderFactory: () => MeshProvider;
  private meshProvider: MeshProvider;

  private lastSelected: boolean = false;
  private inited: boolean = false;

  init(engine: Wagon) {
    this.meshProvider = this.meshProviderFactory();
    this.wagon = engine;

    this.mesh = this.meshProvider.createWagonMesh(
      'clickable-wagon-' + this.wagon.getId()
    );
    this.mesh.setEnabled(true);

    this.selectedMesh = this.meshProvider.createSelectorMesh();
    this.selectedMesh.setEnabled(false);

    this.endAMesh = this.meshProvider.createWagonEndMesh(
      'clickable-wagon-' + this.wagon.getId() + '-endA'
    );
    this.endBMesh = this.meshProvider.createWagonEndMesh(
      'clickable-wagon-' + this.wagon.getId() + '-endB'
    );

    this.inited = true;
    this.update();
  }

  update() {
    if (!this.inited) return;

    if (this.wagon.isRemoved()) {
      this.mesh.setEnabled(false);
      this.selectedMesh.setEnabled(false);
      this.endAMesh.setEnabled(false);
      this.endBMesh.setEnabled(false);
    } else {
      const ray = this.wagon.getRay();
      this.mesh.position = CoordinateToBabylonVector3(ray.coord);
      this.mesh.position.y = 4.2;
      this.mesh.rotation.y = ray.dirXZ + Math.PI / 2;

      if (this.selected) {
        this.selectedMesh.position = CoordinateToBabylonVector3(ray.coord);
        this.selectedMesh.position.y = 10;
      }

      this.endAMesh.position = CoordinateToBabylonVector3(
        this.wagon.getA().positionOnTrack.getRay().coord
      );
      this.endAMesh.position.y = 10;
      this.endAMesh.material = this.wagon.getA().hasConnectedEndOf()
        ? this.meshProvider.getMaterial(MaterialName.SelectorRed)
        : this.meshProvider.getMaterial(MaterialName.BedGray);

      this.endBMesh.position = CoordinateToBabylonVector3(
        this.wagon.getB().positionOnTrack.getRay().coord
      );
      this.endBMesh.position.y = 10;
      this.endBMesh.material = this.wagon.getB().hasConnectedEndOf()
        ? this.meshProvider.getMaterial(MaterialName.SelectorRed)
        : this.meshProvider.getMaterial(MaterialName.BedGray);
    }

    if (this.selected && !this.lastSelected) {
      this.selectedMesh.setEnabled(true);
    }

    if (!this.selected && this.lastSelected) {
      this.selectedMesh.setEnabled(false);
    }

    this.lastSelected = this.selected;
  }

  process(command: string) {
    switch (command) {
      case 'forward':
        this.wagon.moveTowardsWagonB(1);
        break;

      case 'backward':
        this.wagon.moveTowardsWagonA(1);
        break;

      case 'stop':
        this.wagon.stop();
        break;

      case 'endA':
        this.wagon.getA().disconnect();
        break;

      case 'endB':
        this.wagon.getB().disconnect();
        break;

      //   case 'stop':
      //     this.wagon.stop();
      //     break;

      case 'delete':
        this.wagon.remove();
        break;
    }
  }
}
