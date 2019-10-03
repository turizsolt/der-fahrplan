import {Engine} from "./Engine";
import {Platform} from "./Platform";

export class Passenger {
    readonly id: number;
    private onPlatform: Platform = null;
    private onEngine: Engine = null;

    constructor(readonly to: Platform, readonly from: Platform) {
        this.id = Math.random() * 1000000 | 0;
        this.onPlatform = from;
    }

    render() {
        console.log('passenger created', this.id, this.from.no, "->", this.to.no);
    }

    checkTrain(engine: Engine) {
        console.log('check engine', this.id);
        engine.getOn(this);
        this.onEngine = engine;

        this.onPlatform.removePassenger(this);
        this.onPlatform = null;
    }

    checkPlatform(platform: Platform) {
        console.log('check platform', this.id);
        if(platform === this.to) {
            this.onEngine.getOff(this);
            this.onEngine = null;
        }
    }
}
