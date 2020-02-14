import { TrackJoint } from '../src/structs/TrackJoint/TrackJoint';
import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { testContainer } from './inversify.config';
import { TYPES } from '../src/structs/TYPES';
import { Track } from '../src/structs/Track/Track';
import { Coordinate } from '../src/structs/Geometry/Coordinate';
import { TrackSwitch } from '../src/structs/TrackSwitch/TrackSwitch';
chai.use(chaiAlmost());

const TrackJointFactory = testContainer.get<() => TrackJoint>(
  TYPES.FactoryOfTrackJoint
);

describe('Track joint - create', () => {
  it('creates new track', () => {
    const j1 = TrackJointFactory().init(0, 0, 0);
    const j2 = TrackJointFactory().init(0, 10, 0);
    const result = j1.connect(j2);

    const createdSegment = (result.track as Track).getSegment();
    expect(createdSegment.getFirstPoint()).deep.equals(new Coordinate(0, 0, 0));
    expect(createdSegment.getLastPoint()).deep.equals(new Coordinate(0, 0, 10));
  });

  it('creates new track, then switch', () => {
    const j1 = TrackJointFactory().init(0, 0, 0);
    const j2 = TrackJointFactory().init(0, 10, 0);
    const j3 = TrackJointFactory().init(5, 10, (1 / 4) * Math.PI);
    j2.connect(j1);
    const result = j3.connect(j1);

    const createdSegment1 = (result.track as TrackSwitch).getSegmentE();
    const createdSegment2 = (result.track as TrackSwitch).getSegmentF();
    expect(createdSegment1.getFirstPoint()).deep.equals(
      new Coordinate(0, 0, 0)
    );
    expect(createdSegment1.getLastPoint()).deep.equals(
      new Coordinate(0, 0, 10)
    );
    expect(createdSegment2.getFirstPoint()).deep.equals(
      new Coordinate(0, 0, 0)
    );
    expect(createdSegment2.getLastPoint()).deep.equals(
      new Coordinate(5, 0, 10)
    );
  });

  it('creates new track, then switch in opposite direction', () => {
    const j1 = TrackJointFactory().init(0, 0, 0);
    const j2 = TrackJointFactory().init(0, 10, 0);
    const j3 = TrackJointFactory().init(5, 0, -(1 / 4) * Math.PI);
    j2.connect(j1);
    const result = j2.connect(j3);

    const createdSegment1 = (result.track as TrackSwitch).getSegmentE();
    const createdSegment2 = (result.track as TrackSwitch).getSegmentF();
    expect(createdSegment1.getFirstPoint()).deep.equals(
      new Coordinate(0, 0, 10)
    );
    expect(createdSegment1.getLastPoint()).deep.equals(new Coordinate(0, 0, 0));
    expect(createdSegment2.getFirstPoint()).deep.equals(
      new Coordinate(0, 0, 10)
    );
    expect(createdSegment2.getLastPoint()).deep.equals(new Coordinate(5, 0, 0));
  });

  it('creates new switch among tracks', () => {
    const j1 = TrackJointFactory().init(0, 0, 0);
    const j2 = TrackJointFactory().init(0, 10, 0);
    const j3 = TrackJointFactory().init(0, 20, 0);
    const j4 = TrackJointFactory().init(0, 30, 0);

    const j3b = TrackJointFactory().init(5, 20, (1 / 4) * Math.PI);
    const j4b = TrackJointFactory().init(10, 30, 0);

    const r1 = j1.connect(j2);
    const r2 = j2.connect(j3);
    const r3 = j3.connect(j4);
    const r3b = j3b.connect(j4b);

    const tr1 = r1.track as Track;
    const tr2 = r2.track as Track;
    const tr3 = r3.track as Track;
    const tr3b = r3b.track as Track;

    expect(tr1.getB().connectedToEnd).equals(tr2.getA());
    expect(tr2.getB().connectedToEnd).equals(tr3.getA());

    const rs = j2.connect(j3b);
    const sw = rs.track as TrackSwitch;

    // console.log(
    //   tr1.getId(),
    //   tr2.getId(),
    //   tr3.getId(),
    //   tr3b.getId(),
    //   sw.getId()
    // );
    // console.log(
    //   sw.getA().connectedToEnd && sw.getA().connectedToEnd.getHash(),
    //   sw.getE().phisicallyCconnectedToEnd &&
    //     sw.getE().phisicallyCconnectedToEnd.getHash(),
    //   sw.getF().phisicallyCconnectedToEnd &&
    //     sw.getF().phisicallyCconnectedToEnd.getHash()
    // );

    expect(tr1.getB().connectedToEnd).equals(sw.getA());
    expect(sw.getE().phisicallyCconnectedToEnd).equals(tr3b.getA());
    expect(sw.getF().phisicallyCconnectedToEnd).equals(tr3.getA());
  });

  it('creates new switch among tracks in opposite direction', () => {
    const j1 = TrackJointFactory().init(0, 0, 0);
    const j2 = TrackJointFactory().init(0, 10, 0);
    const j3 = TrackJointFactory().init(0, 20, 0);
    const j4 = TrackJointFactory().init(0, 30, 0);

    const j1b = TrackJointFactory().init(10, 0, 0);
    const j2b = TrackJointFactory().init(5, 10, -(1 / 4) * Math.PI);

    const r1 = j1.connect(j2);
    const r2 = j2.connect(j3);
    const r3 = j3.connect(j4);
    const r1b = j1b.connect(j2b);

    const tr1 = r1.track as Track;
    const tr2 = r2.track as Track;
    const tr3 = r3.track as Track;
    const tr1b = r1b.track as Track;

    expect(tr1.getB().connectedToEnd).equals(tr2.getA());
    expect(tr2.getB().connectedToEnd).equals(tr3.getA());

    const rs = j2b.connect(j3);
    const sw = rs.track as TrackSwitch;

    // console.log(
    //   tr1.getId(),
    //   tr2.getId(),
    //   tr3.getId(),
    //   tr1b.getId(),
    //   sw.getId()
    // );
    // console.log(
    //   sw.getA().connectedToEnd && sw.getA().connectedToEnd.getHash(),
    //   sw.getE().phisicallyCconnectedToEnd &&
    //     sw.getE().phisicallyCconnectedToEnd.getHash(),
    //   sw.getF().phisicallyCconnectedToEnd &&
    //     sw.getF().phisicallyCconnectedToEnd.getHash()
    // );

    expect(tr3.getA().connectedToEnd).equals(sw.getA());
    expect(sw.getE().phisicallyCconnectedToEnd).equals(tr1b.getB());
    expect(sw.getF().phisicallyCconnectedToEnd).equals(tr1.getB());
  });
});
