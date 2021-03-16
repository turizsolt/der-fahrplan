import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { testContainer } from '../../src/di/test.config';
import { TYPES } from '../../src/di/TYPES';
import { Commander } from '../../src/structs/Actuals/Store/Commander';
import { Store } from '../../src/structs/Interfaces/Store';
import { TrackJoint } from '../../src/structs/Interfaces/TrackJoint';
chai.use(chaiAlmost());

export const store: Store = testContainer
    .get<() => Store>(TYPES.FactoryOfStore)()
    .init();

describe('Commander', () => {
    it('createTrackJoint', () => {
        const id = 'tj1';
        const commander = new Commander(store, store.getLogStore());
        const tj: TrackJoint = commander.createTrackJoint(id, 0, 0, 0);
        expect(tj.getId()).equals(id);
    });

    it('removeTrackJoint', () => {
        const id = 'tj1';
        const commander = new Commander(store, store.getLogStore());
        const tj: TrackJoint = commander.createTrackJoint(id, 0, 0, 0);
        commander.removeTrackJoint(id);
        expect(tj.getId()).equals(id);
    });
});

/*
  ??? commander.createTrack("TrackId", [0, 0, 0]);
  ??? commander.removeTrack("TrackId", [0, 0, 0]);

  commander.createTrackJoint("id", [0]);
  commander.removeTrackJoint("id", [0]);
  commander.joinTrackJoints("id1", "A", "id2", "A");
  commander.unjoinTrackJoints("id1", "A", "id2", "A");
*/
