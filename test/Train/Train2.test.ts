import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { ActualTrain2 } from '../../src/modules/Train/ActualTrain2';
chai.use(chaiAlmost());

describe('Train2', () => {
  it('create a Train2', () => {
    const train = new ActualTrain2().init(null);
    expect(train).not.equals(null);
  });
});
