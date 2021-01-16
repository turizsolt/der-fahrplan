import { Land } from '../Interfaces/Land';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/TYPES';
import { PassengerGenerator } from './PassengerGenerator';
import { Store } from '../Interfaces/Store';
import { FIRST_LEVEL } from '../../levels/FirstLevel';
import { SECOND_LEVEL } from '../../levels/SecondLevel';
import { TEST_LEVEL } from '../../levels/TestLevel';

@injectable()
export class ActualLand implements Land {
  @inject(TYPES.PassengerGenerator) passengerGenerator: PassengerGenerator;
  @inject(TYPES.FactoryOfStore) storeFactory: () => Store;

  init(): void {
    const store: Store = this.storeFactory().init();

    const levelId = window.location.search.slice(1);
    const levels = {
      first: FIRST_LEVEL,
      second: SECOND_LEVEL,
      test: TEST_LEVEL
    };

    if (levels[levelId]) {
      setTimeout(() => store.loadAll(levels[levelId].data), 1000);
    }

    this.passengerGenerator.init();
  }
}
