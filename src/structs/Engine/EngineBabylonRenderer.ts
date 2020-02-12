import * as BABYLON from 'babylonjs';
import { CoordinateToBabylonVector3 } from '../CoordinateToBabylonVector3';
import { EngineRenderer } from './EngineRenderer';
import { Engine } from './Engine';
import { injectable } from 'inversify';

@injectable()
export class EngineBabylonRenderer implements EngineRenderer {
  private renderEngine: BABYLON.Mesh;
  private engine: Engine;
  readonly scene: BABYLON.Scene;

  init(engine: Engine) {
    this.engine = engine;

    this.renderEngine = BABYLON.MeshBuilder.CreateBox(
      'box',
      { height: 3, width: 3, depth: 10 },
      this.scene
    );

    var boxMaterial = new BABYLON.StandardMaterial('boxMat', this.scene);
    boxMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
    this.renderEngine.material = boxMaterial;

    this.update();
  }

  update() {
    this.renderEngine.position = CoordinateToBabylonVector3(
      this.engine.getPosition()
    );
    this.renderEngine.rotation.y = this.engine.getRotation();
  }
}
