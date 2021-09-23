import * as BABYLON from 'babylonjs';

const gridWidth = 5000;
const gridHeight = 5000;

export class GridDrawer {
  private scene: BABYLON.Scene;

  constructor() { }

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

    // draw the grid
    const HEIGHT = (10 * Math.sqrt(3)) / 2;
    const WIDTH = 10;

    /*
    for (let i = -500; i < 500; i++) {
      const gridVer0 = BABYLON.MeshBuilder.CreateLines(
        'gridVer',
        {
          points: [
            new BABYLON.Vector3(-500 * WIDTH, 0.01, i * HEIGHT),
            new BABYLON.Vector3(500 * WIDTH, 0.01, i * HEIGHT)
          ]
        },
        this.scene
      );
      gridVer0.color = new BABYLON.Color3(0, 0, 0);

      const gridVer1 = BABYLON.MeshBuilder.CreateLines(
        'gridVer',
        {
          points: [
            new BABYLON.Vector3(
              (-500 * WIDTH) / 2 + i * WIDTH,
              0.01,
              -500 * HEIGHT
            ),
            new BABYLON.Vector3((500 * WIDTH) / 2 + i * WIDTH, 0.01, 500 * HEIGHT)
          ]
        },
        this.scene
      );
      gridVer1.color = new BABYLON.Color3(0, 0, 0);

      const gridVer2 = BABYLON.MeshBuilder.CreateLines(
        'gridVer',
        {
          points: [
            new BABYLON.Vector3(
              (500 * WIDTH) / 2 + i * WIDTH,
              0.01,
              -500 * HEIGHT
            ),
            new BABYLON.Vector3(
              (-500 * WIDTH) / 2 + i * WIDTH,
              0.01,
              500 * HEIGHT
            )
          ]
        },
        this.scene
      );
      gridVer2.color = new BABYLON.Color3(0, 0, 0);
    }
    */
  }
}
