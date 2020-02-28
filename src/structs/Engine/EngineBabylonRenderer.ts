import * as BABYLON from 'babylonjs';
import { CoordinateToBabylonVector3 } from '../CoordinateToBabylonVector3';
import { EngineRenderer } from './EngineRenderer';
import { Engine } from './Engine';
import { injectable } from 'inversify';
import { BaseBabylonRenderer } from '../Base/BaseBabylonRenderer';

@injectable()
export class EngineBabylonRenderer extends BaseBabylonRenderer
  implements EngineRenderer {
  private renderEngine: BABYLON.Mesh;
  private engine: Engine;
  readonly scene: BABYLON.Scene;

  private matNorm: BABYLON.StandardMaterial;
  private matSel: BABYLON.StandardMaterial;

  init(engine: Engine) {
    this.engine = engine;

    this.renderEngine = BABYLON.MeshBuilder.CreateBox(
      'clickable-engine-' + this.engine.getId(),
      { height: 3, width: 3, depth: 10 },
      this.scene
    );

    this.matNorm = new BABYLON.StandardMaterial('boxMat', this.scene);
    this.matNorm.diffuseColor = new BABYLON.Color3(1, 0, 0);

    this.matSel = new BABYLON.StandardMaterial('boxMat', this.scene);
    this.matSel.diffuseColor = new BABYLON.Color3(1, 0, 1);
    this.renderEngine.material = this.matNorm;

    this.update();
  }

  update() {
    const ray = this.engine.getRay();
    this.renderEngine.position = CoordinateToBabylonVector3(ray.coord);
    this.renderEngine.position.y = 1.5;
    this.renderEngine.rotation.y = ray.dirXZ;
    this.renderEngine.material = this.selected ? this.matSel : this.matNorm;
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
    }
  }
}
