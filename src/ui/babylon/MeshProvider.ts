import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import { injectable } from 'inversify';
import { Ray } from '../../structs/Geometry/Ray';
import { CoordinateToBabylonVector3 } from './converters/CoordinateToBabylonVector3';
import { Left, Right } from '../../structs/Geometry/Directions';
import { RayPair } from '../../structs/Geometry/RayPair';
import { Line } from '../../structs/Geometry/Line';
import { MaterialName } from './MaterialName';
import { ActualTrackCurve } from '../../modules/Track/ActualTrackCurve';
import { Coordinate } from '../../structs/Geometry/Coordinate';

@injectable()
export class MeshProvider {
  private library: { [id: string]: BABYLON.Mesh };
  private scene: BABYLON.Scene;

  private materials: Record<MaterialName, BABYLON.StandardMaterial>;
  private sleeperBrown: BABYLON.StandardMaterial;
  private bedGray: BABYLON.StandardMaterial;
  private railBlack: BABYLON.StandardMaterial;
  private selectorRed: BABYLON.StandardMaterial;
  private shuntingRed: BABYLON.StandardMaterial;
  private allowingGreen: BABYLON.StandardMaterial;
  private amber: BABYLON.StandardMaterial;
  private blue: BABYLON.StandardMaterial;
  private white: BABYLON.StandardMaterial;

  private selectorMesh: BABYLON.Mesh;
  private E1: BABYLON.Mesh;
  private E2: BABYLON.Mesh;
  private L1: BABYLON.Mesh;
  private defaultEngine: BABYLON.Mesh;

  public getMaterial(name: MaterialName) {
    return this.materials[name];
  }

  init(): MeshProvider {
    return this;
  }

  setScene(scene: BABYLON.Scene): void {
    this.scene = scene;

    this.library = {};
    const names = ['wagon', 'engine', 'mot', 'utas', 'vez'];

    names.map(name => {
      BABYLON.SceneLoader.ImportMesh(
        '', //['Engine'],
        './assets/',
        `${name}.glb`,
        scene,
        newMeshes => {
          newMeshes[0].rotationQuaternion = null;
          newMeshes[0].setEnabled(false);

          this.library[name] = newMeshes[0] as BABYLON.Mesh;
          this.library[name].freezeWorldMatrix();
        }
      );
    });

    this.sleeperBrown = new BABYLON.StandardMaterial('sleeperBrown', null);
    this.sleeperBrown.diffuseColor = new BABYLON.Color3(
      140 / 255,
      62 / 255,
      25 / 255
    );
    this.sleeperBrown.freeze();

    this.bedGray = new BABYLON.StandardMaterial('bedGray', null);
    this.bedGray.diffuseColor = new BABYLON.Color3(
      100 / 255,
      97 / 255,
      72 / 255
    );
    this.bedGray.freeze();

    this.railBlack = new BABYLON.StandardMaterial('railBlack', null);
    this.railBlack.diffuseColor = new BABYLON.Color3(
      25 / 255,
      23 / 255,
      18 / 255
    );
    this.railBlack.freeze();

    this.selectorRed = new BABYLON.StandardMaterial('selectorRed', null);
    this.selectorRed.diffuseColor = new BABYLON.Color3(
      0 / 255,
      206 / 255,
      209 / 255
    );
    this.selectorRed.freeze();

    this.shuntingRed = new BABYLON.StandardMaterial('shuntingRed', null);
    this.shuntingRed.diffuseColor = new BABYLON.Color3(
      255 / 255,
      0 / 255,
      0 / 255
    );
    this.shuntingRed.freeze();

    this.allowingGreen = new BABYLON.StandardMaterial('allowingGreen', null);
    this.allowingGreen.diffuseColor = new BABYLON.Color3(
      0 / 255,
      255 / 255,
      0 / 255
    );
    this.allowingGreen.freeze();

    this.amber = new BABYLON.StandardMaterial('amber', null);
    this.amber.diffuseColor = new BABYLON.Color3(255 / 255, 255 / 255, 0 / 255);
    this.amber.freeze();

    this.blue = new BABYLON.StandardMaterial('blue', null);
    this.blue.diffuseColor = new BABYLON.Color3(0 / 255, 0 / 255, 255 / 255);
    this.blue.freeze();

    this.white = new BABYLON.StandardMaterial('white', null);
    this.white.diffuseColor = new BABYLON.Color3(
      255 / 255,
      255 / 255,
      255 / 255
    );
    this.white.freeze();

    this.materials = {
      [MaterialName.BedGray]: this.bedGray,
      [MaterialName.RailBlack]: this.railBlack,
      [MaterialName.SleeperBrown]: this.sleeperBrown,
      [MaterialName.SelectorRed]: this.selectorRed,
      [MaterialName.ShuntingRed]: this.shuntingRed,
      [MaterialName.AllowingGreen]: this.allowingGreen,
      [MaterialName.Amber]: this.amber,
      [MaterialName.Blue]: this.blue,
      [MaterialName.White]: this.white
    };

    this.selectorMesh = BABYLON.MeshBuilder.CreateCylinder(
      'selector',
      {
        diameterTop: 3,
        diameterBottom: 0,
        tessellation: 6,
        height: 3
      },
      null
    );
    this.selectorMesh.material = this.selectorRed;
    this.selectorMesh.material.freeze();
    this.selectorMesh.freezeWorldMatrix();
    this.selectorMesh.setEnabled(false);

    this.E1 = this.createBedSegmentMesh(new RayPair(Ray.from(0, 0, 0, 0), Ray.from(0, 0, 10, 0)), '', true);
    this.E2 = this.createBedSegmentMesh(new RayPair(Ray.from(0, 0, 0, 0), Ray.from(0, 0, 20, 0)), '', true);

    const HEIGHT = (10 * Math.sqrt(3)) / 2;
    const WIDTH = 10;
    const curve = new ActualTrackCurve([new Coordinate(0, 0, 0), new Coordinate(0, 0, WIDTH), new Coordinate(-HEIGHT, 0, 1.5 * WIDTH)]); // todo get the constants
    const chain = curve.getLineSegmentChain();

    this.L1 = this.createBedSegmentMeshes(chain.getRayPairs(), '', true);

    this.E1.setEnabled(false);
    this.E2.setEnabled(false);
    this.L1.setEnabled(false);

    this.defaultEngine = BABYLON.MeshBuilder.CreateBox(
      '',
      { height: 3.5, width: 14, depth: 3 },
      this.scene
    );
    this.defaultEngine.position.y = -1;
    this.defaultEngine.material = this.blue;
    this.defaultEngine.setEnabled(false);
  }

  createE1(name: string): BABYLON.Mesh {
    return this.E1.clone(name, null);
  }

  createE2(name: string): BABYLON.Mesh {
    return this.E2.clone(name, null);
  }

  createL1(name: string): BABYLON.Mesh {
    return this.L1.clone(name, null);
  }

  createWagonMesh(id: string, name: string): BABYLON.Mesh {
    const x = this.defaultEngine.clone(name, null);
    // const y = this.library[id].clone(name, null);
    // x.setEnabled(false);
    // y.addLODLevel(200, x);
    return x;
  }

  createSelectorMesh(): BABYLON.Mesh {
    const x = this.selectorMesh.clone('', null);
    x.addLODLevel(500, null);
    return x;

  }

  createPathBlockMesh(name: string): BABYLON.Mesh {
    const mesh = BABYLON.MeshBuilder.CreateCylinder(
      name,
      {
        diameterTop: 6,
        diameterBottom: 6,
        tessellation: 12,
        height: 1
      },
      null
    );
    mesh.material = this.bedGray;
    return mesh;
  }

  createStationMesh(name: string, radius): BABYLON.Mesh {
    const mesh = BABYLON.MeshBuilder.CreateTorus(
      name,
      {
        diameter: 2 * radius,
        thickness: 1,
        tessellation: 24
      },
      null
    );
    return mesh;
  }

  createWagonEndMesh(name: string): BABYLON.Mesh {
    const mesh = BABYLON.MeshBuilder.CreateCylinder(
      name,
      {
        diameterTop: 1.5,
        diameterBottom: 0,
        tessellation: 6,
        height: 1.5
      },
      null
    );
    mesh.material = this.selectorRed;
    return mesh;
  }

  createSleeperMesh(ray: Ray, name: string): BABYLON.Mesh {
    const mesh = BABYLON.MeshBuilder.CreateBox(
      name,
      { height: 0.1, width: 3, depth: 1 },
      this.scene
    );
    mesh.position = CoordinateToBabylonVector3(ray.setY(1.05).coord);
    mesh.rotation.y = ray.dirXZ;
    mesh.material = this.sleeperBrown;
    return mesh;
  }

  createSignalMesh(ray: Ray, name: string): BABYLON.Mesh {
    const mesh = BABYLON.MeshBuilder.CreateBox(
      name,
      { height: 5, width: 2.5, depth: 0.5 },
      this.scene
    );
    mesh.position = CoordinateToBabylonVector3(ray.setY(2.5).coord);
    mesh.rotation.y = ray.dirXZ;
    mesh.material = this.railBlack;
    return mesh;
  }

  createSignalLight(ray: Ray, name: string): BABYLON.Mesh {
    const mesh = BABYLON.MeshBuilder.CreateBox(
      name,
      { height: 1.5, width: 1.5, depth: 0.5 },
      this.scene
    );
    mesh.position = CoordinateToBabylonVector3(ray.setY(3.75).coord);
    mesh.rotation.y = ray.dirXZ;
    mesh.material = this.railBlack;
    return mesh;
  }

  createSensorMesh(ray: Ray, name: string): BABYLON.Mesh {
    const mesh = BABYLON.MeshBuilder.CreateCylinder(
      name,
      {
        diameterTop: 1.5,
        diameterBottom: 1.5,
        tessellation: 3,
        height: 0.25
      },
      null
    );
    mesh.position = CoordinateToBabylonVector3(ray.setY(1.375).coord);
    mesh.rotation.y = ray.dirXZ;
    mesh.material = this.white;
    return mesh;
  }

  createBlockJointMesh(name: string): BABYLON.Mesh {
    const mesh = BABYLON.MeshBuilder.CreateCylinder(
      name,
      {
        diameterTop: 2,
        diameterBottom: 2,
        tessellation: 3,
        height: 2
      },
      null
    );
    mesh.material = this.allowingGreen;
    return mesh;
  }

  createBlockMesh(name: string): BABYLON.Mesh {
    const mesh = BABYLON.MeshBuilder.CreateCylinder(
      name,
      {
        diameterTop: 4,
        diameterBottom: 4,
        tessellation: 6,
        height: 0.1
      },
      null
    );
    mesh.material = this.bedGray;
    return mesh;
  }

  createSectionMesh(name: string): BABYLON.Mesh {
    const mesh = BABYLON.MeshBuilder.CreateCylinder(
      name,
      {
        diameterTop: 1.5,
        diameterBottom: 1.5,
        tessellation: 12,
        height: 1
      },
      null
    );
    mesh.material = this.white;
    return mesh;
  }

  createSleeperJointMesh(ray: Ray, name: string): BABYLON.Mesh {
    const mesh = BABYLON.MeshBuilder.CreateBox(
      name,
      { height: 1.5, width: 1, depth: 2 },
      this.scene
    );
    mesh.position = CoordinateToBabylonVector3(ray.setY(0.75).coord);
    mesh.rotation.y = ray.dirXZ;
    mesh.material = this.railBlack;
    return mesh;
  }

  createSwitchSleeperMesh(a: Ray, b: Ray, name: string): BABYLON.Mesh {
    const up = 1.1;
    const dn = 1.0;
    const w = 1.5;
    const h = 0.5;

    const lineA0 = Line.fromPointAndDir(
      a.fromHere(Left, w).fromHere(0, h).coord,
      a.dirXZ + Right
    );
    const lineB0 = Line.fromPointAndDir(
      b.fromHere(Right, w).fromHere(0, h).coord,
      b.dirXZ + Left
    );
    const cross0 = new Ray(lineA0.getIntersectionsWith(lineB0)[0], 0);

    const lineA1 = Line.fromPointAndDir(
      a.fromHere(Left, w).fromHere(0, -h).coord,
      a.dirXZ + Right
    );
    const lineB1 = Line.fromPointAndDir(
      b.fromHere(Right, w).fromHere(0, -h).coord,
      b.dirXZ + Left
    );
    const cross1 = new Ray(lineA1.getIntersectionsWith(lineB1)[0], 0);

    const pu0 = a
      .fromHere(Left, w)
      .fromHere(0, -h)
      .setY(up);
    const pu1 = a
      .fromHere(Left, w)
      .fromHere(0, h)
      .setY(up);
    const pu2 = cross0.setY(up);
    const pu3 = b
      .fromHere(Right, w)
      .fromHere(0, h)
      .setY(up);
    const pu4 = b
      .fromHere(Right, w)
      .fromHere(0, -h)
      .setY(up);
    const pu5 = cross1.setY(up);

    const pd0 = a
      .fromHere(Left, w)
      .fromHere(0, -h)
      .setY(dn);
    const pd1 = a
      .fromHere(Left, w)
      .fromHere(0, h)
      .setY(dn);
    const pd2 = cross0.setY(dn);
    const pd3 = b
      .fromHere(Right, w)
      .fromHere(0, h)
      .setY(dn);
    const pd4 = b
      .fromHere(Right, w)
      .fromHere(0, -h)
      .setY(dn);
    const pd5 = cross1.setY(dn);

    const triangles = [
      ...sext(pu0, pu1, pu2, pu3, pu4, pu5),
      ...sext(pd4, pd3, pd2, pd1, pd0, pd5),
      ...rect(pu0, pu1, pd0, pd1),
      ...rect(pu1, pu2, pd1, pd2),
      ...rect(pu2, pu3, pd2, pd3),
      ...rect(pu3, pu4, pd3, pd4),
      ...rect(pu4, pu5, pd4, pd5),
      ...rect(pu5, pu0, pd5, pd0)
    ];
    const mesh = new BABYLON.Mesh(name, null);
    const vertexData = new BABYLON.VertexData();
    vertexData.positions = triangles;
    vertexData.indices = ind(triangles);
    vertexData.applyToMesh(mesh);
    mesh.material = this.sleeperBrown;
    return mesh;
  }

  createRailSegmentMesh(rp: RayPair, name: string): BABYLON.Mesh {
    const up = 1.5;
    const dn = 1.1;
    const w = 0.2;

    const pu0 = rp.a.fromHere(Right, w).setY(up);
    const pu1 = rp.a.fromHere(Left, w).setY(up);
    const pd1 = rp.a.fromHere(Left, w).setY(dn);
    const pd0 = rp.a.fromHere(Right, w).setY(dn);

    const qu0 = rp.b.fromHere(Right, w).setY(up);
    const qu1 = rp.b.fromHere(Left, w).setY(up);
    const qd1 = rp.b.fromHere(Left, w).setY(dn);
    const qd0 = rp.b.fromHere(Right, w).setY(dn);

    const triangles = [
      ...rect(pu0, qu0, pu1, qu1), // up
      ...rect(pu0, pd0, qu0, qd0), // left
      ...rect(pu1, qu1, pd1, qd1), // right
      ...rect(pd0, pd1, qd0, qd1) // bottom
    ];

    const mesh = new BABYLON.Mesh(name, null);
    const vertexData = new BABYLON.VertexData();
    vertexData.positions = triangles;
    vertexData.indices = ind(triangles);
    vertexData.applyToMesh(mesh);
    mesh.material = this.railBlack;
    return mesh;
  }

  createBedSegmentMesh(seg: RayPair, name: string, secret: boolean = false): BABYLON.Mesh {
    return this.createBedSegmentMeshes([seg], name, secret);
  }

  createBedSegmentMeshes(segs: RayPair[], name: string, secret: boolean = false): BABYLON.Mesh {
    const triangles = [];
    for (let seg of segs) {
      const p0 = seg.a.fromHere(Right, 3).setY(0);
      const p1 = seg.a.fromHere(Right, 2).setY(1);
      const p2 = seg.a.fromHere(Left, 2).setY(1);
      const p3 = seg.a.fromHere(Left, 3).setY(0);

      const q0 = seg.b.fromHere(Right, 3).setY(0);
      const q1 = seg.b.fromHere(Right, 2).setY(1);
      const q2 = seg.b.fromHere(Left, 2).setY(1);
      const q3 = seg.b.fromHere(Left, 3).setY(0);

      triangles.push(...rect(p0, q0, p1, q1));
      triangles.push(...rect(p1, q1, p2, q2));
      triangles.push(...rect(p2, q2, p3, q3));
    }

    const mesh = new BABYLON.Mesh(name, null);
    const vertexData = new BABYLON.VertexData();
    vertexData.positions = triangles;
    vertexData.indices = ind(triangles);
    vertexData.applyToMesh(mesh);
    mesh.convertToUnIndexedMesh();
    mesh.material = secret ? this.amber : this.bedGray;
    mesh.material.freeze();
    mesh.freezeWorldMatrix();
    return mesh;
  }
}

const tri = (a, b, c) => {
  return [...a.getArr(), ...b.getArr(), ...c.getArr()];
};

const rect = (a, b, c, d) => {
  return [...tri(a, b, c), ...tri(c, b, d)];
};

const sext = (a, b, c, d, e, f) => {
  return [...tri(b, a, f), ...tri(c, b, f), ...tri(d, c, f), ...tri(e, d, f)];
};

const ind = pos => {
  return new Array(pos.length / 3).fill(0).map((v, i) => i);
};
