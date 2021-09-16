import { Station } from './Station';

export interface AbstractPlatform {
    getStation(): Station;
    setStation(station: Station): void;
}
