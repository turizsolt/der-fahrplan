import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { ActualTrackOcupancy } from '../../../src/modules/Track/ActualTrackOcupancy';
import { Wagon } from '../../../src/structs/Interfaces/Wagon';
import { getTestStore } from '../../getTestStore';
import { TYPES } from '../../../src/di/TYPES';
chai.use(chaiAlmost());

const store = getTestStore();
const wagon: Wagon = store.create<Wagon>(TYPES.Wagon).init();
const wagon2: Wagon = store.create<Wagon>(TYPES.Wagon).init();

describe('TrackOcupancy', () => {
  it('create, checkin, checkout, isempty, get', () => {
    const ocupancy = new ActualTrackOcupancy();
    expect(ocupancy.isEmpty()).equals(true);
    ocupancy.checkin(wagon);
    expect(ocupancy.isEmpty()).equals(false);
    expect(ocupancy.getCheckedList()).deep.equals([wagon]);
    ocupancy.checkin(wagon2);
    expect(ocupancy.isEmpty()).equals(false);
    expect(ocupancy.getCheckedList()).deep.equals([wagon, wagon2]);
    ocupancy.checkout(wagon2);
    expect(ocupancy.isEmpty()).equals(false);
    ocupancy.checkout(wagon);
    expect(ocupancy.isEmpty()).equals(true);
  });
});
