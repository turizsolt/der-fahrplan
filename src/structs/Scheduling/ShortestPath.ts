import { Station } from './Station';
import { Trip } from './Trip';

export interface ShortestPath {
    station: Station;
    departureTime: number;
    path: { trip: Trip, station: Station }[];
}
