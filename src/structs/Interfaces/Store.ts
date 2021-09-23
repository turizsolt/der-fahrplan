import { TravelPathes } from '../../modules/Travel/TravelPathes';
import { InputController } from '../../ui/controllers/InputController';
import { CommandLog } from '../Actuals/Store/Command/CommandLog';
import { BaseStorable } from './BaseStorable';

export interface Store {
    init();
    clear();
    register(object: BaseStorable, presetId?: string): string;
    unregister(object: BaseStorable): void;
    get(id: string): BaseStorable;
    getAll(): Record<string, BaseStorable>;
    getAllOf<T extends BaseStorable>(type: symbol): T[];
    getFiltered(filter: (b: BaseStorable) => boolean): BaseStorable[];
    persistAll(): Object;
    loadAll(arr: any[]);
    create<T>(type: symbol): T;

    setSelected(selected: BaseStorable): void;
    getSelected(): BaseStorable;
    clearSelected(): void;

    tick(): void;
    setTickSpeed(speed: number): void;
    getTickSpeed(): number;
    getTickCount(): number;

    addArrivedPassengerStats(stats: { time: number, distance: number }): void;
    getPassengerStats(): any;

    getCommandLog(): CommandLog;

    generateId(): string;

    setInputController(ic: InputController): void;
    getInputController(): InputController;

    getTravelPathes(): TravelPathes;
}
