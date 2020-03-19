import { TrackJoint } from '../../src/structs/Interfaces/TrackJoint';
import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { testContainer } from '../inversify.config';
import { TYPES } from '../../src/structs/TYPES';
import { Coordinate } from '../../src/structs/Geometry/Coordinate';
chai.use(chaiAlmost());

const newTrackJoint = (a, b, c) => {
  const tj = testContainer.get<TrackJoint>(TYPES.TrackJoint);
  tj.init(a, b, c);
  return tj;
};

describe('Track joint - equation', () => {
  it('a = 0 equ', () => {
    const j = newTrackJoint(0, 2, (0 / 180) * Math.PI).getRay();
    expect(j.slope()).almost(0);
    expect(j.equ()).deep.almost({ a: 0, b: 0 });
  });

  it('a = 1 equ', () => {
    const j = newTrackJoint(4, 2, (45 / 180) * Math.PI).getRay();
    expect(j.slope()).almost(1);
    expect(j.equ()).deep.almost({ a: 1, b: 2 });
  });

  it('a = 2 equ', () => {
    const j = newTrackJoint(5, 2, Math.atan2(4, 2)).getRay();
    expect(j.slope()).almost(2);
    expect(j.equ()).deep.almost({ a: 2, b: 1 });
  });

  it('a = Inf equ', () => {
    const j = newTrackJoint(5, 2, Math.atan2(4, 0)).getRay();
    expect(j.slope()).equals(Infinity);
    expect(j.equ()).deep.equals({ a: Infinity, z: 2 });
  });
});

describe('Track joint - define points', () => {
  it('general case', () => {
    const j1 = newTrackJoint(0, 0, (45 / 180) * Math.PI).getRay();
    const j2 = newTrackJoint(0, 20, (-45 / 180) * Math.PI).getRay();
    expect(j1.computeMidpoint(j2)).deep.almost(new Coordinate(10, 0, 10));
  });

  it('aligned on x axis', () => {
    const j1 = newTrackJoint(0, 0, (0 / 180) * Math.PI).getRay();
    const j2 = newTrackJoint(0, 20, (0 / 180) * Math.PI).getRay();
    expect(j1.computeMidpoint(j2)).equals(undefined);
  });

  it('not aligned on x axis', () => {
    const j1 = newTrackJoint(10, 20, (0 / 180) * Math.PI).getRay();
    const j2 = newTrackJoint(0, 20, (0 / 180) * Math.PI).getRay();
    expect(j1.computeMidpoint(j2)).equals(false);
  });

  it('aligned on z axis', () => {
    const j1 = newTrackJoint(0, 0, (90 / 180) * Math.PI).getRay();
    const j2 = newTrackJoint(20, 0, (90 / 180) * Math.PI).getRay();
    expect(j1.slope()).equals(Infinity);
    expect(j2.slope()).equals(Infinity);
    expect(j1.computeMidpoint(j2)).equals(undefined);
  });

  it('not aligned on z axis', () => {
    const j1 = newTrackJoint(10, 0, (90 / 180) * Math.PI).getRay();
    const j2 = newTrackJoint(0, 20, (90 / 180) * Math.PI).getRay();
    expect(j1.slope()).equals(Infinity);
    expect(j2.slope()).equals(Infinity);
    expect(j1.computeMidpoint(j2)).deep.almost(false);
  });

  it('aligned on angle', () => {
    const j1 = newTrackJoint(0, 0, (30 / 180) * Math.PI).getRay();
    const j2 = newTrackJoint(
      30,
      30 * Math.sqrt(3),
      (30 / 180) * Math.PI
    ).getRay();
    expect(j1.equ().b).almost(0);
    expect(j2.equ().b).almost(0);
    expect(j1.computeMidpoint(j2)).equals(undefined);
  });

  it('not aligned on angle', () => {
    const j1 = newTrackJoint(10, 0, (30 / 180) * Math.PI).getRay();
    const j2 = newTrackJoint(0, 20, (30 / 180) * Math.PI).getRay();
    expect(j1.computeMidpoint(j2)).deep.almost(false);
  });
});
