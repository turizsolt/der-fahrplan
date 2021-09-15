import { getStore } from "../../structs/Actuals/Store/StoreForVue";
import { Passenger } from "./Passenger";
import { Store } from "../../structs/Interfaces/Store";
import { Station } from "../../structs/Scheduling/Station";

const store: Store = getStore();

export class PassengerRelocator {
    static insideStation(passenger: Passenger, station: Station) {

    }
}
