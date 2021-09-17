import { Boardable } from '../../mixins/Boardable';
import { Coordinate } from '../../structs/Geometry/Coordinate';
import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { Station } from './Station';

export interface AbstractPlatform extends Boardable, BaseBrick {
    getStation(): Station;
    setStation(station: Station): void;
    getNo(): string;
    setNo(no: string): void;
    getPosition(): Coordinate;
    getId(): string;
}
