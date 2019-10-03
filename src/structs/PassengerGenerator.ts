import * as BABYLON from "babylonjs";
import {Passenger} from "./Passenger";
import {Platform} from "./Platform";

export class PassengerGenerator {
    private interval: number;

    constructor(readonly platformList: Platform[], readonly scene:BABYLON.Scene) {
        this.interval = setInterval(() => this.tick(), 500) as unknown as number;
        this.tick();
    }

    tick() {
        if(Math.random() < .8) {
            const length = this.platformList.length;
            const fromIdx = Math.random() * length | 0;
            const toIdx = Math.random() * length | 0;
            if(toIdx !== fromIdx) {
                const passenger = new Passenger(this.platformList[toIdx], this.platformList[fromIdx], this.scene);
                this.platformList[fromIdx].addPassenger(passenger);
                passenger.render();
            }
        }

        if(Math.random() < 0.01) {
            clearInterval(this.interval);
        }
    }
}
