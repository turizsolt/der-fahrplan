import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { testContainer } from '../../../src/di/test.config';
import { TYPES } from '../../../src/di/TYPES';
import { Wagon } from '../../../src/structs/Interfaces/Wagon';
import { Store } from '../../../src/structs/Interfaces/Store';
import { Train } from '../../../src/structs/Scheduling/Train';
import { Coordinate } from '../../../src/structs/Geometry/Coordinate';
import { Track } from '../../../src/structs/Interfaces/Track';
chai.use(chaiAlmost());

const store: Store = testContainer
  .get<() => Store>(TYPES.FactoryOfStore)()
  .init();
store.clear();
const WagonFactory: () => Wagon = () => store.create<Wagon>(TYPES.Wagon);
const TrackFactory: () => Track = () => store.create<Track>(TYPES.Track);

describe('Train', () => {
  it('remove', () => {
    const w1 = WagonFactory().init();
    const train = w1.getTrain();

    expect(train.isRemoved()).equals(false);

    train.remove();

    expect(train.isRemoved()).equals(true);
  });

  it('persist and load', () => {
    store.clear();
    const track = TrackFactory().init([
      new Coordinate(0, 0, 0),
      new Coordinate(0, 0, 100)
    ]);
    const w1 = WagonFactory().init();
    w1.putOnTrack(track);
    const train = w1.getTrain();

    const obj: any = train.persist();

    const all: any = store.persistAll();
    store.clear();
    store.loadAll(all);

    const storedTrain = store.get(obj.id) as Train;

    expect(storedTrain.getId()).equals(train.getId());
    expect(storedTrain.getWagons().length).equals(train.getWagons().length);
    expect(storedTrain.getWagons()[0].getTrain()).equals(storedTrain);
  });
});
