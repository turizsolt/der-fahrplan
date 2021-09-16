import { Boardable } from '../../mixins/Boardable';
import { Coordinate } from '../../structs/Geometry/Coordinate';
import { Station } from './Station';

export interface AbstractPlatform extends Boardable {
    getStation(): Station;
    setStation(station: Station): void;
    getNo(): string;
    setNo(no: string): void;
    getPosition(): Coordinate;
}
