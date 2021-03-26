import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { testContainer } from '../../src/di/test.config';
import { TYPES } from '../../src/di/TYPES';
import { CommandCreator } from '../../src/structs/Actuals/Store/Command/CommandCreator';
import { CommandMode } from '../../src/structs/Actuals/Store/Command/CommandMode';
import { Store } from '../../src/structs/Interfaces/Store';
import { TrackJoint } from '../../src/structs/Interfaces/TrackJoint';
chai.use(chaiAlmost());

export const store: Store = testContainer
    .get<() => Store>(TYPES.FactoryOfStore)()
    .init();

describe('Commander', () => {
    const commandLog = store.getCommandLog();

    before(() => {
        commandLog.setMode(CommandMode.Master);
    });

    beforeEach(() => {
        store.clear();
    });

    it('createTrackJoint', () => {
        const id = 'tj1';
        // const command = ;
        commandLog.addAction(CommandCreator.createTrackJoint(id, 0, 0, 0));

        const tj = store.get(id) as TrackJoint;
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
