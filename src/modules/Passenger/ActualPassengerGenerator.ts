import { Passenger } from './Passenger';
import { PassengerGenerator } from './PassengerGenerator';
import { injectable, inject } from 'inversify';
import { Store } from '../../structs/Interfaces/Store';
import { TYPES } from '../../di/TYPES';
import { Station } from '../Station/Station';
import { _TypeStore } from 'babylonjs';

@injectable()
export class ActualPassengerGenerator implements PassengerGenerator {
    @inject(TYPES.FactoryOfStore) private StoreFactory: () => Store;
    private store: Store;

    init(): PassengerGenerator {
        this.store = this.StoreFactory();

        setTimeout(() => {
            for (let i = 0; i < 25; i++) {
                this.tick();
            }
        }, 2000);

        return this;
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
