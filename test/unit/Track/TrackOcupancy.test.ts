import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { ActualTrackOcupancy } from '../../../src/modules/Track/ActualTrackOcupancy';
import { getTestStore } from '../../getTestStore';
import { TYPES } from '../../../src/di/TYPES';
import { Train } from '../../../src/modules/Train/Train';
chai.use(chaiAlmost());

const store = getTestStore();
const train: Train = store.create<Train>(TYPES.Train).init(null, []);
const train2: Train = store.create<Train>(TYPES.Train).init(null, []);

describe('TrackOcupancy', () => {
  it('create, checkin, checkout, isempty, get', () => {
    const ocupancy = new ActualTrackOcupancy();
    expect(ocupancy.isEmpty()).equals(true);
    ocupancy.checkin(train);
    expect(ocupancy.isEmpty()).equals(false);
    expect(ocupancy.getCheckedList()).deep.equals([train]);
    ocupancy.checkin(train2);
    expect(ocupancy.isEmpty()).equals(false);
    expect(ocupancy.getCheckedList()).deep.equals([train, train2]);
    ocupancy.checkout(train2);
    expect(ocupancy.isEmpty()).equals(false);
    ocupancy.checkout(train);
    expect(ocupancy.isEmpty()).equals(true);
  });
});
