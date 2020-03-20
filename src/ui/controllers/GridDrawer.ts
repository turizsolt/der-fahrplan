import * as BABYLON from 'babylonjs';

export class GridDrawer {
  private scene: BABYLON.Scene;

  constructor() {}

  setScene(scene: BABYLON.Scene) {
    this.scene = scene;
  }

  drawGrid() {
    const ground = BABYLON.MeshBuilder.CreateGround(
      'ground',
      { width: 300, height: 300 },
      this.scene
    );
    ground.position.y = 0;
    const mat = new BABYLON.StandardMaterial('boxMat', null);
    mat.diffuseColor = new BABYLON.Color3(0.5, 1, 0.5);
    ground.material = mat;

    for (let i = -150; i <= 150; i += 10) {
      const gridVer = BABYLON.MeshBuilder.CreateLines(
        'gridVer',
        {
          points: [
            new BABYLON.Vector3(i, 0.01, -150),
            new BABYLON.Vector3(i, 0.01, 150)
          ]
        },
        this.scene
      );
      gridVer.color = new BABYLON.Color3(0, 0, 0);

      const gridHor = BABYLON.MeshBuilder.CreateLines(
        'gridHor',
        {
          points: [
            new BABYLON.Vector3(-150, 0.01, i),
            new BABYLON.Vector3(150, 0.01, i)
          ]
        },
        this.scene
      );
      gridHor.color = new BABYLON.Color3(0, 0, 0);
    }
  }
}
