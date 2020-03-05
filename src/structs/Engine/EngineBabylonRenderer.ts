import * as BABYLON from 'babylonjs';
import { CoordinateToBabylonVector3 } from '../CoordinateToBabylonVector3';
import { EngineRenderer } from './EngineRenderer';
import { Engine } from './Engine';
import { injectable, inject } from 'inversify';
import { BaseBabylonRenderer } from '../Base/BaseBabylonRenderer';
import { MeshProvider } from '../../babylon/MeshProvider';
import { TYPES } from '../TYPES';

@injectable()
export class EngineBabylonRenderer extends BaseBabylonRenderer
  implements EngineRenderer {
  private mesh: BABYLON.AbstractMesh;
  private engine: Engine;
  readonly scene: BABYLON.Scene;

  @inject(TYPES.FactoryOfMeshProvider)
  private meshProviderFactory: () => MeshProvider;
  private meshProvider: MeshProvider;

  private lastSelected: boolean = false;
  private highlight: BABYLON.HighlightLayer;

  init(engine: Engine) {
    this.meshProvider = this.meshProviderFactory();
    this.engine = engine;
    this.highlight = new BABYLON.HighlightLayer('hl1', null);

    this.mesh = this.meshProvider.createEngineMesh(
      'clickable-engine-' + this.engine.getId()
    );
    this.mesh.setEnabled(true);

    this.update();
  }

  update() {
    if (this.engine.isRemoved()) {
      this.mesh.setEnabled(false);
    } else {
      const ray = this.engine.getRay();
      this.mesh.position = CoordinateToBabylonVector3(ray.coord);
      this.mesh.position.y = 4.2;
      this.mesh.rotation.y = ray.dirXZ + Math.PI / 2;
    }

    if (this.selected && !this.lastSelected) {
      this.mesh
        .getChildMeshes()
        .map(ch =>
          this.highlight.addMesh(ch as BABYLON.Mesh, BABYLON.Color3.Yellow())
        );
    }

    if (!this.selected && this.lastSelected) {
      this.mesh
        .getChildMeshes()
        .map(ch => this.highlight.removeMesh(ch as BABYLON.Mesh));
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
