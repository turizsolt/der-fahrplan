import * as BABYLON from 'babylonjs';
import { CoordinateToBabylonVector3 } from './converters/CoordinateToBabylonVector3';
import { EngineRenderer } from '../../structs/Renderers/EngineRenderer';
import { Engine } from '../../structs/Interfaces/Engine';
import { injectable, inject } from 'inversify';
import { BaseBabylonRenderer } from './BaseBabylonRenderer';
import { MeshProvider } from './MeshProvider';
import { TYPES } from '../../structs/TYPES';

@injectable()
export class EngineBabylonRenderer extends BaseBabylonRenderer
  implements EngineRenderer {
  private mesh: BABYLON.AbstractMesh;
  private selectedMesh: BABYLON.AbstractMesh;
  private engine: Engine;
  readonly scene: BABYLON.Scene;

  @inject(TYPES.FactoryOfMeshProvider)
  private meshProviderFactory: () => MeshProvider;
  private meshProvider: MeshProvider;

  private lastSelected: boolean = false;

  init(engine: Engine) {
    this.meshProvider = this.meshProviderFactory();
    this.engine = engine;

    this.mesh = this.meshProvider.createEngineMesh(
      'clickable-engine-' + this.engine.getId()
    );
    this.mesh.setEnabled(true);

    this.selectedMesh = this.meshProvider.createSelectorMesh();
    this.selectedMesh.setEnabled(false);

    this.update();
  }

  update() {
    if (this.engine.isRemoved()) {
      this.mesh.setEnabled(false);
      this.selectedMesh.setEnabled(false);
    } else {
      const ray = this.engine.getRay();
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
      case 'forward':
        this.engine.forward();
        break;

      case 'backward':
        this.engine.backward();
        break;

      case 'stop':
        this.engine.stop();
        break;

      case 'delete':
        this.engine.remove();
        break;
    }
  }
}
