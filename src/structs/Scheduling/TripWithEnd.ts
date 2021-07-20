import { Trip } from "./Trip";
import { TripEnd } from "./TripEnd";

export interface TripWithEnd {
    end: TripEnd;
    time: number;
    timeStr: string;
    trip: any;
}
