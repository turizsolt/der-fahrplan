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
import { GlobalController } from '../../ui/controllers/GlobalController';
import { TestFw } from '../../levels/TestFw';
import { DEMO_ONE_TRACK } from '../../levels/DemoOneTrack';
import { DEMO_TWO_TRACKS } from '../../levels/DemoTwoTracks';

@injectable()
export class ActualLand implements Land {
  @inject(TYPES.FactoryOfStore) storeFactory: () => Store;

  init(globalController: GlobalController): void {
    const store: Store = this.storeFactory();

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
      demoonetrack: DEMO_ONE_TRACK,
      demotwotracks: DEMO_TWO_TRACKS,

      test: TEST_LEVEL
    };

    const loadLevel = () => {
      if (levels[levelId]) {
        setTimeout(() => {
          store.loadAll(levels[levelId].data);
          if (levels[levelId].camera) {
            globalController.loadSpecific(levels[levelId]);
          }
          if (levels[levelId].target_passenger) {
            globalController.setTargetPassenger(levels[levelId].target_passenger);
          }
          if (levels[levelId].actions) {
            store.getCommandLog().setActions(levels[levelId].actions);
          }
        }, 1000);
      }
    };

    if (levelId === 'complex') {

      fetch('complex.json')
        .then(response => response.text())
        .then(text => levels['complex'] = JSON.parse(text))
        .then(() => {
          loadLevel();
        });
    } else {
      loadLevel();
    }
  }
}
