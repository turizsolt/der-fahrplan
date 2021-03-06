import { Passenger } from '../Interfaces/Passenger';
import { PassengerGenerator } from './PassengerGenerator';
import { injectable, inject } from 'inversify';
import { Store } from '../Interfaces/Store';
import { TYPES } from '../../di/TYPES';
import { Station } from '../Scheduling/Station';
import { _TypeStore } from 'babylonjs';

@injectable()
export class ActualPassengerGenerator implements PassengerGenerator {
  @inject(TYPES.FactoryOfStore) private StoreFactory: () => Store;
  private store: Store;

  init() {
    this.store = this.StoreFactory();

    setTimeout(() => {
      for (let i = 0; i < 25; i++) {
        this.tick();
      }
    }, 2000);
  }

  tick() {
    const stationList = this.store.getAllOf<Station>(TYPES.Station);
    if (stationList.length === 0) return;

    let ok = false;
    if (Math.random() < 0.8) {
      const length = stationList.length;
      do {
        const fromIdx = (Math.random() * length) | 0;
        const toIdx = (Math.random() * length) | 0;
        if (toIdx !== fromIdx) {
          this.store.create<Passenger>(TYPES.Passenger).init(
            stationList[toIdx],
            stationList[fromIdx]
          );
          ok = true;
        }
      }
      while (!ok);
    }
  }
}
