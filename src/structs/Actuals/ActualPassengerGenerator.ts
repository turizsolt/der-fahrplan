import { Passenger } from '../Interfaces/Passenger';
import { Platform } from '../Interfaces/Platform';
import { PassengerGenerator } from './PassengerGenerator';
import { injectable, inject } from 'inversify';
import { Store } from '../Interfaces/Store';
import { TYPES } from '../TYPES';
import { Station } from '../Scheduling/Station';

@injectable()
export class ActualPassengerGenerator implements PassengerGenerator {
  private interval: number;
  @inject(TYPES.FactoryOfPassenger) private PassengerFactory: () => Passenger;
  @inject(TYPES.FactoryOfStore) private StoreFactory: () => Store;
  private store: Store;

  init() {
    this.store = this.StoreFactory();
    this.interval = (setInterval(() => this.tick(), 100) as unknown) as number;
    this.tick();
  }

  tick() {
    const stationList = this.store.getAllOf<Station>(TYPES.Station);
    if (stationList.length === 0) return;

    if (Math.random() < 0.8) {
      const length = stationList.length;
      const fromIdx = (Math.random() * length) | 0;
      const toIdx = (Math.random() * length) | 0;
      if (toIdx !== fromIdx) {
        const passenger = this.PassengerFactory().init(
          stationList[toIdx],
          stationList[fromIdx]
        );
      }
    }
  }
}
