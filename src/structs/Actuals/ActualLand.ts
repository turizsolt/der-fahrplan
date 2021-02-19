import { Land } from '../Interfaces/Land';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/TYPES';
import { Store } from '../Interfaces/Store';
import { FIRST_LEVEL } from '../../levels/FirstLevel';
import { SECOND_LEVEL } from '../../levels/SecondLevel';
import { THIRD_LEVEL } from '../../levels/ThirdLevel';
import { FORTH_LEVEL } from '../../levels/ForthLevel';
import { FIFTH_LEVEL } from '../../levels/FifthLevel';
import { SIXTH_LEVEL } from '../../levels/SixthLevel';
import { SEVENTH_LEVEL } from '../../levels/SeventhLevel';
import { EIGHTH_LEVEL } from '../../levels/EighthLevel';
import { TEST_LEVEL } from '../../levels/TestLevel';
import { InputController } from '../../ui/controllers/InputController';
import { TestFw } from '../../levels/TestFw';

@injectable()
export class ActualLand implements Land {
  @inject(TYPES.FactoryOfStore) storeFactory: () => Store;

  init(inputController: InputController): void {
    const store: Store = this.storeFactory().init();

    const levelId = window.location.search.slice(1);
    const levels = {
      first: FIRST_LEVEL,
      second: SECOND_LEVEL,
      third: THIRD_LEVEL,
      forth: FORTH_LEVEL,
      fifth: FIFTH_LEVEL,
      sixth: SIXTH_LEVEL,
      seventh: SEVENTH_LEVEL,
      eighth: EIGHTH_LEVEL,
      testfw: TestFw,

      test: TEST_LEVEL
    };

    if (levels[levelId]) {
      setTimeout(() => {
        store.loadAll(levels[levelId].data);
        if (levels[levelId].camera) {
          inputController.setCamera(levels[levelId].camera);
        }
        if (levels[levelId].target_passenger) {
          inputController.setTargetPassenger(levels[levelId].target_passenger);
        }
        if (levels[levelId].actions) {
          store.getActionStore().setActions(levels[levelId].actions);
        }
      }, 1000);

    }
  }
}
