import * as BABYLON from 'babylonjs';
import { injectable } from 'inversify';
import { Ray } from '../structs/Geometry/Ray';
import { CoordinateToBabylonVector3 } from '../structs/CoordinateToBabylonVector3';
import { Left, Right } from '../structs/Geometry/Directions';
import { RayPair } from '../structs/Geometry/RayPair';

@injectable()
export class MeshProvider {
  private engine: BABYLON.AbstractMesh;
  private scene: BABYLON.Scene;

  private sleeperBrown: BABYLON.StandardMaterial;
  private bedGray: BABYLON.StandardMaterial;
  private railBlack: BABYLON.StandardMaterial;

  init(scene: BABYLON.Scene) {
    this.scene = scene;

    BABYLON.SceneLoader.ImportMesh(
      '', //['Engine'],
      './assets/',
      'engine.glb',
      scene,
      newMeshes => {
        //console.log('x', newMeshes.map(x => x.name));
        newMeshes[0].rotationQuaternion = null;
        newMeshes[0].setEnabled(false);

        this.engine = newMeshes[0];
      }
    );

    this.sleeperBrown = new BABYLON.StandardMaterial('sleeperBrown', null);
    this.sleeperBrown.diffuseColor = new BABYLON.Color3(
      140 / 255,
      62 / 255,
      25 / 255
    );

    this.bedGray = new BABYLON.StandardMaterial('bedGray', null);
    this.bedGray.diffuseColor = new BABYLON.Color3(
      100 / 255,
      97 / 255,
      72 / 255
    );

    this.railBlack = new BABYLON.StandardMaterial('railBlack', null);
    this.railBlack.diffuseColor = new BABYLON.Color3(
      25 / 255,
      23 / 255,
      18 / 255
    );
  }

  createEngineMesh(name: string): BABYLON.AbstractMesh {
    const clone = this.engine.clone(name, null);
    return clone;
  }

  createSleeperMesh(ray: Ray): BABYLON.AbstractMesh {
    const mesh = BABYLON.MeshBuilder.CreateBox(
      'sleeper',
      { height: 0.1, width: 3, depth: 1 },
      this.scene
    );
    mesh.position = CoordinateToBabylonVector3(ray.setY(1.05).coord);
    mesh.rotation.y = ray.dirXZ;
    mesh.material = this.sleeperBrown;
    return mesh;
  }

  createRailSegmentMesh([p, q]: Ray[]): BABYLON.AbstractMesh {
    const up = 1.5;
    const dn = 1.1;
    const w = 0.2;

    const pu0 = p.fromHere(Left, w).setY(up);
    const pu1 = p.fromHere(Right, w).setY(up);
    const pd1 = p.fromHere(Right, w).setY(dn);
    const pd0 = p.fromHere(Left, w).setY(dn);

    const qu0 = q.fromHere(Left, w).setY(up);
    const qu1 = q.fromHere(Right, w).setY(up);
    const qd1 = q.fromHere(Right, w).setY(dn);
    const qd0 = q.fromHere(Left, w).setY(dn);

    const triangles = [
      ...rect(pu0, qu0, pu1, qu1), // up
      ...rect(pu0, pd0, qu0, qd0), // left
      ...rect(pu1, qu1, pd1, qd1), // right
      ...rect(pd0, pd1, qd0, qd1) // bottom
    ];

    const mesh = new BABYLON.Mesh('railSegment', null);
    const vertexData = new BABYLON.VertexData();
    vertexData.positions = triangles;
    vertexData.indices = ind(triangles);
    vertexData.applyToMesh(mesh);
    mesh.material = this.railBlack;
    return mesh;
  }

  createBedSegmentMesh(seg: RayPair): BABYLON.AbstractMesh {
    const p0 = seg.a.fromHere(Left, 3).setY(0);
    const p1 = seg.a.fromHere(Left, 2).setY(1);
    const p2 = seg.a.fromHere(Right, 2).setY(1);
    const p3 = seg.a.fromHere(Right, 3).setY(0);

    const q0 = seg.b.fromHere(Left, 3).setY(0);
    const q1 = seg.b.fromHere(Left, 2).setY(1);
    const q2 = seg.b.fromHere(Right, 2).setY(1);
    const q3 = seg.b.fromHere(Right, 3).setY(0);

    const triangles = [
      ...rect(p0, q0, p1, q1),
      ...rect(p1, q1, p2, q2),
      ...rect(p2, q2, p3, q3)
    ];

    const mesh = new BABYLON.Mesh('bedSegment', null);
    const vertexData = new BABYLON.VertexData();
    vertexData.positions = triangles;
    vertexData.indices = ind(triangles);
    vertexData.applyToMesh(mesh);
    mesh.material = this.bedGray;
    return mesh;
  }
}

const tri = (a, b, c) => {
  return [...a.getArr(), ...b.getArr(), ...c.getArr()];
};

const rect = (a, b, c, d) => {
  return [...tri(a, b, c), ...tri(c, b, d)];
};

const ind = pos => {
  return new Array(pos.length / 3).fill(0).map((v, i) => i);
};
