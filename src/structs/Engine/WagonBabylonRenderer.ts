import * as BABYLON from 'babylonjs';
import { CoordinateToBabylonVector3 } from '../CoordinateToBabylonVector3';
import { Engine } from './Engine';
import { injectable, inject } from 'inversify';
import { BaseBabylonRenderer } from '../Base/BaseBabylonRenderer';
import { MeshProvider } from '../../babylon/MeshProvider';
import { TYPES } from '../TYPES';
import { WagonRenderer } from './WagonRenderer';
import { Wagon } from './Wagon';

@injectable()
export class WagonBabylonRenderer extends BaseBabylonRenderer
  implements WagonRenderer {
  private mesh: BABYLON.AbstractMesh;
  private selectedMesh: BABYLON.AbstractMesh;
  private wagon: Wagon;
  readonly scene: BABYLON.Scene;

  @inject(TYPES.FactoryOfMeshProvider)
  private meshProviderFactory: () => MeshProvider;
  private meshProvider: MeshProvider;

  private lastSelected: boolean = false;

  init(engine: Wagon) {
    this.meshProvider = this.meshProviderFactory();
    this.wagon = engine;

    this.mesh = this.meshProvider.createWagonMesh(
      'clickable-wagon-' + this.wagon.getId()
    );
    this.mesh.setEnabled(true);

    this.selectedMesh = this.meshProvider.createSelectorMesh();
    this.selectedMesh.setEnabled(false);

    this.update();
  }

  update() {
    if (this.wagon.isRemoved()) {
      this.mesh.setEnabled(false);
      this.selectedMesh.setEnabled(false);
    } else {
      const ray = this.wagon.getRay();
      this.mesh.position = CoordinateToBabylonVector3(ray.coord);
      this.mesh.position.y = 4.2;
      this.mesh.rotation.y = ray.dirXZ + Math.PI / 2;

      if (this.selected) {
        this.selectedMesh.position = CoordinateToBabylonVector3(ray.coord);
        this.selectedMesh.position.y = 10;
      }
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
      //   case 'forward':
      //     this.wagon.forward();
      //     break;

      //   case 'backward':
      //     this.wagon.backward();
      //     break;

      //   case 'stop':
      //     this.wagon.stop();
      //     break;

      case 'delete':
        this.wagon.remove();
        break;
    }
  }
}
