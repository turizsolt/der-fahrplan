import { Coordinate } from '../../structs/Geometry/Coordinate';
import { Color } from '../../structs/Color';
import { Side } from '../../structs/Interfaces/Side';
import { TrackBase } from '../Track/TrackBase';
import { LineSegmentChain } from '../../structs/Geometry/LineSegmentChain';
import { Station } from '../../modules/Station/Station';
import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { Boardable } from '../../mixins/Boardable';
import { PositionOnTrack } from '../Train/PositionOnTrack';
import { AbstractPlatform } from './AbstractPlatform';

export interface Platform extends BaseBrick, Boardable, AbstractPlatform {
    isBeside(position: number): boolean;
    isBesidePoT(pot: PositionOnTrack): boolean;

    pseudoBoard(): Coordinate;

    getLineSegmentChain(): LineSegmentChain;
    isPartOfStation(station: Station): boolean;

    getWidth(): number;
    getLength(): number;
    getPosition(): Coordinate;
    getRotation(): number;
    getNo(): string;
    getColor(): Color;
    remove(): boolean;
    isRemoved(): boolean;

    init(
        track: TrackBase,
        start: number,
        end: number,
        side: Side,
        width?: number
    ): Platform;

    initX(station: Station, no: string): Platform;
}
