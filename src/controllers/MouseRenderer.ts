import * as BABYLON from 'babylonjs';

export class MouseRenderer {
  private mouseMesh: BABYLON.Mesh;
  private scene: BABYLON.Scene;

  init(scene: BABYLON.Scene): MouseRenderer {
    this.scene = scene;

    const arrowMaterial = new BABYLON.StandardMaterial('arrow', scene);
    arrowMaterial.diffuseTexture = new BABYLON.Texture(
      'assets/arrow.png',
      scene
    );

    const mouseMesh = BABYLON.MeshBuilder.CreateCylinder(
      'cone',
      {
        diameter: 5,
        tessellation: 24,
        height: 1,
        faceUV: [
          new BABYLON.Vector4(0, 0, 1, 1),
          new BABYLON.Vector4(1, 1, 1, 1)
        ],
        faceColors: [
          new BABYLON.Color4(0, 0, 0, 1),
          new BABYLON.Color4(0, 0, 0, 1),
          new BABYLON.Color4(1, 1, 0, 1)
        ],
        updatable: true
      },
      this.scene
    );
    mouseMesh.material = arrowMaterial;
    this.mouseMesh = mouseMesh;

    return this;
  }

  update(position, rotation, viewMode) {
    this.mouseMesh.position = position;
    this.mouseMesh.rotation.y = rotation;
    this.mouseMesh.setEnabled(viewMode === 1);
  }
}
