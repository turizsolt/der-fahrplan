import { injectable } from "inversify";
import { TYPES } from "../../di/TYPES";
import { ActualBoardable } from "../../mixins/ActualBoardable";
import { applyMixins } from "../../mixins/ApplyMixins";
import { Emitable } from "../../mixins/Emitable";
import { ActualBaseBrick } from "../../structs/Actuals/ActualBaseBrick";
import { Color } from "../../structs/Color";
import { Coordinate } from "../../structs/Geometry/Coordinate";
import { Store } from "../../structs/Interfaces/Store";
import { BaseRenderer } from "../../structs/Renderers/BaseRenderer";
import { Passenger } from "../Passenger/Passenger";
import { Station } from "./Station";
import { WaitingHall } from "./WaitingHall";

export interface ActualWaitingHall extends Emitable { }
const doApply = () => applyMixins(ActualWaitingHall, [Emitable]);
@injectable()
export class ActualWaitingHall extends ActualBaseBrick implements WaitingHall {
    private boardable: ActualBoardable = new ActualBoardable();
    private position: Coordinate;
    private station: Station;

    init(position: Coordinate): WaitingHall {
        super.initStore(TYPES.WaitingHall);
        this.position = position;

        this.emit('init', this.persistDeep());

        return this;
    }

    getPosition(): Coordinate {
        return this.position;
    }

    getRadius(): number {
        return 10;
    }

    setStation(station: Station): void {
        this.station = station;
    }

    getStation(): Station {
        return this.station;
    }

    getColor(): Color {
        return this.station?.getColor();
    }

    board(passenger: Passenger): Coordinate {
        this.boardable.board(passenger);

        if (!this.position) return null;

        const rand = Math.random() * Math.PI * 2 - Math.PI;
        const dist = Math.random() * 5;
        const offset = new Coordinate(
            Math.sin(rand) * dist,
            0,
            Math.cos(rand) * dist
        );
        return this.position.add(offset);
    }

    unboard(passenger: Passenger): void {
        this.boardable.unboard(passenger);
    }

    getBoardedPassengers(): Passenger[] {
        return this.boardable.getBoardedPassengers();
    }

    getRenderer(): BaseRenderer {
        throw new Error("Method not implemented.");
    }

    persist(): any {
        return {
            id: this.id,
            type: 'WaitingHall',
            position: {
                x: this.position.x,
                y: this.position.y,
                z: this.position.z
            }
        }
    }

    load(obj: any, store: Store): void {
        this.presetId(obj.id);
        this.init(new Coordinate(obj.position.x, obj.position.y, obj.position.z));
    }
}

doApply();
