import { Boardable } from '../../mixins/Boardable';
import { Station } from './Station';

export interface AbstractPlatform extends Boardable {
    getStation(): Station;
    setStation(station: Station): void;
}
