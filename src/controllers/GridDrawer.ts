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
    ground.position.y = -1.5;

    for (let i = -150; i <= 150; i += 10) {
      const gridVer = BABYLON.MeshBuilder.CreateLines(
        'gridVer',
        {
          points: [
            new BABYLON.Vector3(i, -1.49, -150),
            new BABYLON.Vector3(i, -1.49, 150)
          ]
        },
        this.scene
      );
      gridVer.color = new BABYLON.Color3(0, 0, 0);

      const gridHor = BABYLON.MeshBuilder.CreateLines(
        'gridHor',
        {
          points: [
            new BABYLON.Vector3(-150, -1.49, i),
            new BABYLON.Vector3(150, -1.49, i)
          ]
        },
        this.scene
      );
      gridHor.color = new BABYLON.Color3(0, 0, 0);
    }
  }
}
