import * as BABYLON from 'babylonjs';

const gridWidth = 300;
const gridHeight = 300;

export class GridDrawer {
  private scene: BABYLON.Scene;

  constructor() {}

  setScene(scene: BABYLON.Scene) {
    this.scene = scene;
  }

  drawGrid() {
    const ground = BABYLON.MeshBuilder.CreateGround(
      'ground',
      { width: gridWidth, height: gridHeight },
      this.scene
    );
    ground.position.y = 0;
    const mat = new BABYLON.StandardMaterial('boxMat', null);
    mat.diffuseColor = new BABYLON.Color3(0.5, 1, 0.5);
    ground.material = mat;

    for (let i = -gridWidth / 2; i <= gridWidth / 2; i += 10) {
      const gridVer = BABYLON.MeshBuilder.CreateLines(
        'gridVer',
        {
          points: [
            new BABYLON.Vector3(i, 0.01, -gridHeight / 2),
            new BABYLON.Vector3(i, 0.01, gridHeight / 2)
          ]
        },
        this.scene
      );
      gridVer.color = new BABYLON.Color3(0, 0, 0);
    }

    for (let i = -gridHeight / 2; i <= gridHeight / 2; i += 10) {
      const gridHor = BABYLON.MeshBuilder.CreateLines(
        'gridHor',
        {
          points: [
            new BABYLON.Vector3(-gridWidth / 2, 0.01, i),
            new BABYLON.Vector3(gridWidth / 2, 0.01, i)
          ]
        },
        this.scene
      );
      gridHor.color = new BABYLON.Color3(0, 0, 0);
    }
  }
}
