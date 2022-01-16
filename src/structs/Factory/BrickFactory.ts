import { ActualRoute2 } from "../Scheduling/ActualRoute2";
import { Route2 } from "../Scheduling/Route2";

export class BrickFactory {
    createRoute2(no: string, color: string): Route2 {
        return new ActualRoute2(no, color);
    }

    /* singleton pattern */

    private static __instance: BrickFactory = null;

    static getInstance(): BrickFactory {
        if (!BrickFactory.__instance) {
            BrickFactory.__instance = new BrickFactory();
        }
        return BrickFactory.__instance;
    }
}
