import * as BABYLON from 'babylonjs';
import { TrackCurve } from "../../modules/Track/TrackCurve";
import { Util } from "../../structs/Util";
import { MeshProvider } from "./MeshProvider";

export function renderTrackType(trackType: string, curve: TrackCurve, meshProvider: MeshProvider, name: string): BABYLON.AbstractMesh[] {
  if (trackType.startsWith('E')) {
    const n = Math.round(curve.getLength() / 10);
    const startRay = curve.getLineSegmentChain().getRays()[0]; // todo maybe better asking for it
    let nextRay = startRay.fromHere(0, 0);

    const bedSegmentMeshes: BABYLON.AbstractMesh[] = [];

    const m = (n % 2 === 1) ? n - 1 : n;
    for (let i = 0; i < m; i += 2) {
      const mesh = meshProvider.createE2(name);
      mesh.position.x = nextRay.coord.x;
      mesh.position.y = 0;
      mesh.position.z = nextRay.coord.z;
      mesh.rotation.y = nextRay.dirXZ;
      bedSegmentMeshes.push(mesh);

      nextRay = nextRay.fromHere(0, 20);
    }

    if (n % 2 === 1) {
      const mesh = meshProvider.createE1(name);
      mesh.position.x = nextRay.coord.x;
      mesh.position.y = 0;
      mesh.position.z = nextRay.coord.z;
      mesh.rotation.y = nextRay.dirXZ;
      bedSegmentMeshes.push(mesh);

      nextRay = nextRay.fromHere(0, 10);
    }

    return bedSegmentMeshes;
  } else if (trackType.startsWith('L1')) {
    const bedSegmentMeshes: BABYLON.AbstractMesh[] = [];
    const startRay = curve.getLineSegmentChain().getRays()[0]; // todo maybe better asking for it

    const mesh = meshProvider.createL1(name);
    mesh.position.x = startRay.coord.x;
    mesh.position.y = 0;
    mesh.position.z = startRay.coord.z;
    mesh.rotation.y = startRay.dirXZ;
    bedSegmentMeshes.push(mesh);

    return bedSegmentMeshes;
  } else if (trackType.startsWith('R1')) {
    const bedSegmentMeshes: BABYLON.AbstractMesh[] = [];
    const startRay = Util.last(curve.getLineSegmentChain().getRays());//.fromHere(Math.PI, 0); // todo maybe better asking for it
    startRay.dirXZ = startRay.dirXZ + Math.PI;

    const mesh = meshProvider.createL1(name);
    mesh.position.x = startRay.coord.x;
    mesh.position.y = 0;
    mesh.position.z = startRay.coord.z;
    mesh.rotation.y = startRay.dirXZ;
    bedSegmentMeshes.push(mesh);

    return bedSegmentMeshes;
  } else {
    const chain = curve.getLineSegmentChain();
    const len = curve.getLength();

    const bedSegmentMeshes = chain
      .getRayPairs()
      .map(v => meshProvider.createBedSegmentMesh(v, name));

    return bedSegmentMeshes;

  }
}