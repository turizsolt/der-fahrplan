import * as BABYLON from 'babylonjs';
import { injectable } from 'inversify';

@injectable()
export class BaseBabylonRenderer {
  protected selected: boolean = false;
  protected meshes: BABYLON.AbstractMesh[] = [];

  update() {}
  remove() {
    for (let mesh of this.meshes) {
      mesh.dispose();
    }
    this.meshes = [];
  }

  process(command: string): void {}
}
