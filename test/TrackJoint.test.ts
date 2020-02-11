import { TrackJoint } from '../src/structs/TrackJoint/TrackJoint';
import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
chai.use(chaiAlmost());

describe('Track joint equation', () => {
  it('a = 0 equ', () => {
    const j = new TrackJoint(2, 0, (0 / 180) * Math.PI);
    expect(j.slope()).almost(0);
    expect(j.equ()).deep.almost({ a: 0, b: 0 });
  });

  it('a = 1 equ', () => {
    const j = new TrackJoint(2, 4, (45 / 180) * Math.PI);
    expect(j.slope()).almost(1);
    expect(j.equ()).deep.almost({ a: 1, b: 2 });
  });

  it('a = 2 equ', () => {
    const j = new TrackJoint(2, 5, Math.atan2(4, 2));
    expect(j.slope()).almost(2);
    expect(j.equ()).deep.almost({ a: 2, b: 1 });
  });

  it('a = Inf equ', () => {
    const j = new TrackJoint(2, 5, Math.atan2(4, 0));
    expect(j.slope()).equals(Infinity);
    expect(j.equ()).deep.equals({ a: Infinity, x: 2 });
  });
});

describe('Track joint connect', () => {
  it('general case', () => {
    const j1 = new TrackJoint(0, 0, (45 / 180) * Math.PI);
    const j2 = new TrackJoint(20, 0, (-45 / 180) * Math.PI);
    expect(j1.connect(j2)).deep.almost({ x: 10, z: 10 });
  });

  it('aligned on x axis', () => {
    const j1 = new TrackJoint(0, 0, (0 / 180) * Math.PI);
    const j2 = new TrackJoint(20, 0, (0 / 180) * Math.PI);
    expect(j1.connect(j2)).equals(true);
  });

  it('not aligned on x axis', () => {
    const j1 = new TrackJoint(20, 10, (0 / 180) * Math.PI);
    const j2 = new TrackJoint(20, 0, (0 / 180) * Math.PI);
    expect(j1.connect(j2)).equals(false);
  });

  it('aligned on z axis', () => {
    const j1 = new TrackJoint(0, 0, (90 / 180) * Math.PI);
    const j2 = new TrackJoint(0, 20, (90 / 180) * Math.PI);
    expect(j1.slope()).equals(Infinity);
    expect(j2.slope()).equals(Infinity);
    expect(j1.connect(j2)).equals(true);
  });

  it('not aligned on z axis', () => {
    const j1 = new TrackJoint(0, 10, (90 / 180) * Math.PI);
    const j2 = new TrackJoint(20, 0, (90 / 180) * Math.PI);
    expect(j1.slope()).equals(Infinity);
    expect(j2.slope()).equals(Infinity);
    expect(j1.connect(j2)).deep.almost(false);
  });

  it('aligned on angle', () => {
    const j1 = new TrackJoint(0, 0, (30 / 180) * Math.PI);
    const j2 = new TrackJoint(30 * Math.sqrt(3), 30, (30 / 180) * Math.PI);
    expect(j1.equ().b).almost(0);
    expect(j2.equ().b).almost(0);
    expect(j1.connect(j2)).equals(true);
  });

  it('not aligned on angle', () => {
    const j1 = new TrackJoint(0, 10, (30 / 180) * Math.PI);
    const j2 = new TrackJoint(20, 0, (30 / 180) * Math.PI);
    expect(j1.connect(j2)).deep.almost(false);
  });
});
