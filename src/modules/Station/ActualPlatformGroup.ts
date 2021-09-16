import { Passenger } from '../Passenger/Passenger';
import { Coordinate } from '../../structs/Geometry/Coordinate';
import { Platform } from './Platform';
import { injectable } from 'inversify';
import { TYPES } from '../../di/TYPES';
import { BaseRenderer } from '../../structs/Renderers/BaseRenderer';
import { Store } from '../../structs/Interfaces/Store';
import { Station } from './Station';
import { ActualBoardable } from '../../mixins/ActualBoardable';
import { ActualBaseBrick } from '../../structs/Actuals/ActualBaseBrick';
import { PlatformGroup } from './PlatformGroup';

@injectable()
export class ActualPlatformGroup extends ActualBaseBrick implements PlatformGroup {
    private boardable: ActualBoardable = new ActualBoardable();
    private platforms: Platform[];
    private no: string;

    init(platforms: Platform[]): PlatformGroup {
        this.initStore(TYPES.PlatformGroup);
        this.platforms = platforms;
        this.no = '';

        this.platforms[0]?.getStation().addPlatform(this);

        return this;
    }

    getNo(): string {
        return this.no;
    }

    board(passenger: Passenger): Coordinate {
        this.boardable.board(passenger);

        return this.pseudoBoard();
    }

    pseudoBoard(): Coordinate {
        if (!this.platforms[0]) {
            return Coordinate.Origo();
        }

        const index = Math.random() * this.platforms.length | 0;
        this.platforms[index].pseudoBoard();
    }

    unboard(passenger: Passenger): void {
        this.boardable.unboard(passenger);
    }

    getBoardedPassengers(): Passenger[] {
        return this.boardable.getBoardedPassengers();
    }

    getStation(): Station {
        return this.platforms[0]?.getStation();
    }

    setStation(station: Station): void { }

    getRenderer(): BaseRenderer {
        throw new Error('Method not implemented.');
    }

    persist(): Object {
        return {
            id: this.getId(),
            type: 'PlatformGroup',
            no: this.no,

            platforms: this.platforms.map(p => p.getId())
        };
    }

    load(obj: any, store: Store): void {
        this.presetId(obj.id);
        this.init(
            obj.platforms.map(p => store.get(p) as Platform)
        );
        this.no = obj.no;
    }
}
