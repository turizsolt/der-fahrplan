import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { Wagon } from '../../../src/structs/Interfaces/Wagon';
import { buildTrain, W, store } from './utils';
import { TYPES } from '../../../src/di/TYPES';
import { Track } from '../../../src/structs/Interfaces/Track';
import { Coordinate } from '../../../src/structs/Geometry/Coordinate';
chai.use(chaiAlmost());

const TrackFactory = () => store.create<Track>(TYPES.Track);

const perc = end => {
  return end.getPositionOnTrack().getPercentage();
};

describe('WagonShunting', () => {
  const [cont1, pass2, loco3, pass4, loco5]: Wagon[] = buildTrain(
    W.Cont,
    W.Pass,
    W.Loco,
    W.Pass,
    W.Loco
  );
  const train = cont1.getTrain();
  const track = TrackFactory().init([
    new Coordinate(0, 0, 0),
    new Coordinate(100, 0, 0)
  ]);

  cont1.putOnTrack(track, 0.1);
  pass2.putOnTrack(track, 0.25);
  loco3.putOnTrack(track, 0.4);
  pass4.putOnTrack(track, 0.55);
  loco5.putOnTrack(track, 0.7);

  step('initial config', () => {
    expect(perc(cont1.getA())).almost(0.1);
    expect(perc(cont1.getB())).almost(0.24);
    expect(perc(loco5.getA())).almost(0.7);
    expect(perc(loco5.getB())).almost(0.84);
  });

  step('shunting forward with the middle loco', () => {
    loco3.select();
    loco3.shuntForward();
    loco3.tick();

    expect(perc(cont1.getA())).almost(0.1 - 0.0025);
    expect(perc(cont1.getB())).almost(0.24 - 0.0025);
    expect(perc(loco5.getA())).almost(0.7 - 0.0025);
    expect(perc(loco5.getB())).almost(0.84 - 0.0025);
    loco3.break();
  });

  step('shunting backward with the middle loco', () => {
    loco3.select();
    loco3.shuntBackward();
    loco3.tick();

    expect(perc(cont1.getA())).almost(0.1);
    expect(perc(cont1.getB())).almost(0.24);
    expect(perc(loco5.getA())).almost(0.7);
    expect(perc(loco5.getB())).almost(0.84);
    loco3.break();
  });

  step('shunting forward, then backward with the middle loco', () => {
    loco3.select();
    loco3.shuntForward();
    loco3.tick();
    loco3.shuntBackward();
    loco3.tick();

    expect(perc(cont1.getA())).almost(0.1);
    expect(perc(cont1.getB())).almost(0.24);
    expect(perc(loco5.getA())).almost(0.7);
    expect(perc(loco5.getB())).almost(0.84);
    loco3.break();
  });

  step('cont cannot shunt on its own', () => {
    pass2.getB().disconnect();
    cont1.select();
    cont1.shuntForward();
    cont1.tick();

    expect(perc(cont1.getA())).almost(0.1);
    expect(perc(cont1.getB())).almost(0.24);
    expect(perc(loco5.getA())).almost(0.7);
    expect(perc(loco5.getB())).almost(0.84);
    cont1.break();
  });
});
