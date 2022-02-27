import { injectable, inject } from 'inversify';
import * as shortid from 'shortid';
import { BaseStorable } from '../../Interfaces/BaseStorable';
import { Platform } from '../../../modules/Station/Platform';
import { TYPES } from '../../../di/TYPES';
import { Track } from '../../../modules/Track/Track';
import { TrackSwitch } from '../../../modules/Track/TrackSwitch';
import { TrackJoint } from '../../../modules/Track/TrackJoint/TrackJoint';
import { Station } from '../../../modules/Station/Station';
import { Route } from '../../Scheduling/Route';
import { Store } from '../../Interfaces/Store';
import { Wagon } from '../../Interfaces/Wagon';
import { Passenger } from '../../../modules/Passenger/Passenger';
import { Trip } from '../../Scheduling/Trip';
import { PassengerGenerator } from '../../../modules/Passenger/PassengerGenerator';
import { CommandLog } from './Command/CommandLog';
import { TrackJointRenderer } from '../../Renderers/TrackJointRenderer';
import { BaseRenderer } from '../../Renderers/BaseRenderer';
import { Emitable } from '../../../mixins/Emitable';
import { WagonRenderer } from '../../Renderers/WagonRenderer';
import { Train } from '../../../modules/Train/Train';
import { Signal } from '../../../modules/Signaling/Signal';
import { SignalRenderer } from '../../Renderers/SignalRenderer';
import { Block } from '../../../modules/Signaling/Block';
import { BlockJoint } from '../../../modules/Signaling/BlockJoint';
import { PathBlock } from '../../../modules/Signaling/PathBlock';
import { Section } from '../../../modules/Signaling/Section';
import { BlockRenderer } from '../../Renderers/BlockRenderer';
import { BlockJointRenderer } from '../../Renderers/BlockJointRenderer';
import { PathBlockRenderer } from '../../Renderers/PathBlockRenderer';
import { SectionRenderer } from '../../Renderers/SectionRenderer';
import { Sensor } from '../../../modules/Signaling/Sensor';
import { SensorRenderer } from '../../Renderers/SensorRenderer';
import { CapacityCap } from '../../../modules/Signaling/CapacityCap/CapacityCap';
import { CapacityCapRenderer } from '../../Renderers/CapacityCapRenderer';
import { InputController } from '../../../ui/controllers/InputController';
import { TravelPathes } from '../../../modules/Travel/TravelPathes';
import { WaitingHall } from '../../../modules/Station/WaitingHall';
import { WaitingHallRenderer } from '../../Renderers/WaitingHallRenderer';
import { PlatformGroup } from '../../../modules/Station/PlatformGroup';
import { StationRenderer } from '../../Renderers/StationRenderer';
import { RouteVariant } from '../../Scheduling/RouteVariant';

@injectable()
export class ActualStore implements Store {
    private elements: Record<string, BaseStorable>;
    private typedElements: Record<symbol, BaseStorable[]>;
    private factoryMethods: Record<symbol, () => any>;
    private renderers: Record<symbol, (() => any)[]>;
    private typeOrder: Record<symbol, number>;
    private travelPathes: TravelPathes = new TravelPathes(this);

    @inject(TYPES.FactoryOfRoute) private RouteFactory: () => Route;
    @inject(TYPES.FactoryOfRouteVariant) private RouteVariantFactory: () => RouteVariant;
    @inject(TYPES.FactoryOfTrip) private TripFactory: () => Trip;
    @inject(TYPES.FactoryOfStation) private StationFactory: () => Station;
    @inject(TYPES.FactoryOfWaitingHall) private WaitingHallFactory: () => WaitingHall;
    @inject(TYPES.FactoryOfPassenger) private PassengerFactory: () => Passenger;
    @inject(TYPES.FactoryOfSignal) private SignalFactory: () => Signal;
    @inject(TYPES.FactoryOfSensor) private SensorFactory: () => Sensor;
    @inject(TYPES.FactoryOfBlock) private BlockFactory: () => Block;
    @inject(TYPES.FactoryOfBlockJoint)
    private BlockJointFactory: () => BlockJoint;
    @inject(TYPES.FactoryOfPathBlock) private PathBlockFactory: () => PathBlock;
    @inject(TYPES.FactoryOfSection) private SectionFactory: () => Section;
    @inject(TYPES.FactoryOfCapacityCap) private CapacityCapFactory: () => CapacityCap;

    @inject(TYPES.FactoryOfTrain) private TrainFactory: () => Train;
    @inject(TYPES.FactoryOfTrack) private TrackFactory: () => Track;
    @inject(TYPES.FactoryOfTrackSwitch)
    private TrackSwitchFactory: () => TrackSwitch;
    @inject(TYPES.FactoryOfTrackJoint)
    private TrackJointFactory: () => TrackJoint;
    @inject(TYPES.FactoryOfTrackJointRenderer)
    private TrackJointRendererFactory: () => TrackJointRenderer;
    @inject(TYPES.FactoryOfPlatform) private PlatformFactory: () => Platform;
    @inject(TYPES.FactoryOfPlatformGroup) private PlatformGroupFactory: () => PlatformGroup;
    @inject(TYPES.FactoryOfWagon) private WagonFactory: () => Wagon;
    @inject(TYPES.FactoryOfWagonRenderer)
    private WagonRendererFactory: () => WagonRenderer;
    @inject(TYPES.FactoryOfSignalRenderer)
    private SignalRendererFactory: () => SignalRenderer;
    @inject(TYPES.FactoryOfSensorRenderer)
    private SensorRendererFactory: () => SensorRenderer;
    @inject(TYPES.FactoryOfWaitingHallRenderer)
    private WaitingHallRendererFactory: () => WaitingHallRenderer;

    @inject(TYPES.FactoryOfBlockRenderer)
    private BlockRendererFactory: () => BlockRenderer;
    @inject(TYPES.FactoryOfBlockJointRenderer)
    private BlockJointRendererFactory: () => BlockJointRenderer;
    @inject(TYPES.FactoryOfPathBlockRenderer)
    private PathBlockRendererFactory: () => PathBlockRenderer;
    @inject(TYPES.FactoryOfSectionRenderer)
    private SectionRendererFactory: () => SectionRenderer;
    @inject(TYPES.FactoryOfCapacityCapRenderer) private CapacityCapRendererFactory: () => CapacityCapRenderer;
    @inject(TYPES.FactoryOfStationRenderer) private StationRendererFactory: () => StationRenderer;

    @inject(TYPES.FactoryOfPassengerGenerator)
    private PassengerGeneratorFactory: () => PassengerGenerator;
    private passengerGenerator: PassengerGenerator;

    private logStore: CommandLog;

    init() {
        this.logStore = new CommandLog(this);

        this.elements = {};
        this.typedElements = {};
        this.factoryMethods = {
            [TYPES.Route]: this.RouteFactory,
            [TYPES.RouteVariant]: this.RouteVariantFactory,
            [TYPES.Trip]: this.TripFactory,
            [TYPES.Station]: this.StationFactory,
            [TYPES.WaitingHall]: this.WaitingHallFactory,
            [TYPES.Passenger]: this.PassengerFactory,
            [TYPES.Track]: this.TrackFactory,
            [TYPES.TrackSwitch]: this.TrackSwitchFactory,
            [TYPES.TrackJoint]: this.TrackJointFactory,
            [TYPES.Platform]: this.PlatformFactory,
            [TYPES.PlatformGroup]: this.PlatformGroupFactory,
            [TYPES.Train]: this.TrainFactory,
            [TYPES.Wagon]: this.WagonFactory,
            [TYPES.Signal]: this.SignalFactory,
            [TYPES.Sensor]: this.SensorFactory,
            [TYPES.Block]: this.BlockFactory,
            [TYPES.BlockJoint]: this.BlockJointFactory,
            [TYPES.PathBlock]: this.PathBlockFactory,
            [TYPES.Section]: this.SectionFactory,
            [TYPES.CapacityCap]: this.CapacityCapFactory
        };
        // higher number (12) loads first
        this.typeOrder = {
            [TYPES.TrackJoint]: 22,
            [TYPES.Track]: 21,
            [TYPES.TrackSwitch]: 20,



            // skip zero, cos it is falsy
            [TYPES.Wagon]: -1,
            [TYPES.Train]: -2,
            [TYPES.BlockJoint]: -3,
            [TYPES.Block]: -4,
            [TYPES.PathBlock]: -5,

            [TYPES.Station]: -6,
            [TYPES.Platform]: -6.1,
            [TYPES.PlatformGroup]: -6.2,
            [TYPES.WaitingHall]: -6.3,

            [TYPES.Route]: -7,
            [TYPES.RouteVariant]: -8,
            [TYPES.Trip]: -9,

            [TYPES.Passenger]: -11,
            [TYPES.Sensor]: -14,
            [TYPES.Section]: -15,
            [TYPES.CapacityCap]: -16,
            [TYPES.Signal]: -17
        };

        this.renderers = {
            [TYPES.TrackJoint]: [this.TrackJointRendererFactory],
            [TYPES.Wagon]: [this.WagonRendererFactory],
            [TYPES.Signal]: [this.SignalRendererFactory],
            [TYPES.Sensor]: [this.SensorRendererFactory],
            [TYPES.WaitingHall]: [this.WaitingHallRendererFactory],
            [TYPES.Block]: [this.BlockRendererFactory],
            [TYPES.BlockJoint]: [this.BlockJointRendererFactory],
            [TYPES.PathBlock]: [this.PathBlockRendererFactory],
            [TYPES.Section]: [this.SectionRendererFactory],
            [TYPES.CapacityCap]: [this.CapacityCapRendererFactory],
            [TYPES.Station]: [this.StationRendererFactory]
        };

        shortid.characters(
            '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_*'
        );
        return this;
    }

    create<T>(type: symbol): T {
        if (!this.factoryMethods[type]) return null;
        if (type === Symbol.for('Passenger')) {
            this.passengerCount++;
        }
        const created = this.factoryMethods[type]() as T;
        if (this.renderers[type]) {
            this.renderers[type].map(f => {
                const g: BaseRenderer = f();

                // todo prettify
                ((created as any) as Emitable).on('init', data => g.init(data));
                ((created as any) as Emitable).on('update', data => g.update(data));
                ((created as any) as Emitable).on('remove', id => g.remove(id));
                ((created as any) as Emitable).on('remove', id =>
                    this.unregister(this.get(id))
                );
            });
        }
        return created;
    }

    clear() {
        this.getFiltered(x => x.getType() === Symbol.for('Wagon')).map(e =>
            e.remove()
        );
        this.getFiltered(() => true).map(e => e.remove());

        this.elements = {};
        this.typedElements = {};
    }

    generateId(): string {
        return shortid.generate();
    }

    register(object: BaseStorable, presetId: string = null): string {
        let id = presetId || shortid.generate();
        this.elements[id] = object;

        if (!this.typedElements[object.getType()]) {
            this.typedElements[object.getType()] = [];
        }
        this.typedElements[object.getType()].push(object);
        return id;
    }

    unregister(object: BaseStorable): void {
        let id = object.getId();
        this.typedElements[object.getType()] = this.typedElements[
            object.getType()
        ].filter(x => x.getId() !== id);
        delete this.elements[id];
    }

    get(id: string): BaseStorable {
        return this.elements[id];
    }

    getAll(): Record<string, BaseStorable> {
        return this.elements;
    }

    getAllOf<T extends BaseStorable>(type: symbol): T[] {
        return (this.typedElements[type] || []) as T[];
    }

    getFiltered(filter: (b: BaseStorable) => boolean): BaseStorable[] {
        const ret = [];
        for (let key of Object.keys(this.elements)) {
            const elem = this.elements[key];
            if (filter(elem)) {
                ret.push(elem);
            }
        }
        return ret;
    }

    persistAll(): Object {
        const ret = [];
        for (let key of Object.keys(this.elements)) {
            ret.push(this.elements[key].persist());
        }
        return ret;
    }

    loadAll(arr: any[], version: number) {
        const fx = a => this.typeOrder[Symbol.for(a)] || 999;

        const skipTypes = version === 3 ? [] : ['Route', 'RouteStop', 'Trip'];

        arr.sort((a, b) => {
            return fx(b.type) - fx(a.type);
        });

        arr.map(elem => {
            if (skipTypes.includes(elem.type)) {
                console.log(elem.type, 'has skipped.');
                return;
            }

            const brick: BaseStorable = this.create<BaseStorable>(
                Symbol.for(elem.type)
            );

            if (brick) {
                brick.load(elem, this);
            }
        });

        // to init schedules with a blank nothing
        this.getAllOf(TYPES.Station).map((station: Station) => {
            station.addTripToSchedule(null);
        });

        // to break the dependency loop between 
        // PathBlock/Train/Trip/Route/RouteStop/PathBlock
        // at Train
        arr.map(elem => {
            const brick: BaseStorable = this.get(elem.id);

            if (brick && brick.getType() === TYPES.Train) {
                (brick as Train).loadLater(elem, this);
            }
        });

        this.travelPathes.find(3);
    }

    private selected: BaseStorable = null;

    clearSelected(): void {
        if (this.selected) {
            this.selected.removeSelect();
            this.selected = null;
        }
    }

    setSelected(selected: BaseStorable): void {
        this.clearSelected();
        this.selected = selected;
    }

    getSelected(): BaseStorable {
        return this.selected;
    }

    private tickSpeed: number = 0;
    private tickCount: number = 4 * 60 * 60;

    tick(): void {
        this.tickCount++;

        const trains = this.getAllOf(TYPES.Train);
        trains.map((train: Train) => {
            train.tick();
        });
        this.getAllOf(TYPES.PathBlock).map((pb: PathBlock) => {
            pb.tick();
        });

        if (this.getTickCount() % 120 === 0) {
            if (!this.passengerGenerator) {
                this.passengerGenerator = this.PassengerGeneratorFactory().init();
            }
            this.passengerGenerator.tick();
        }

        if (globalThis.scene) {
            if (this.getTickCount() % 60 === 0) {
                globalThis.scene.unfreezeActiveMeshes();
                globalThis.scene.freezeActiveMeshes();
            }
        }
    }

    setTickSpeed(speed: number): void {
        this.tickSpeed = speed;
        // todo this is not the right place for this
        if (typeof document !== 'undefined') {
            if (speed === 0) {
                document.getElementById('canvasBorder').classList.add('stopped');
            } else {
                document.getElementById('canvasBorder').classList.remove('stopped');
            }
        }
    }

    getTickSpeed(): number {
        return this.tickSpeed;
    }

    getTickCount(): number {
        return this.tickCount;
    }

    private passengerCount: number = 0;
    private passengerArrivedCount: number = 0;
    private passengerCummulatedTime: number = 0;
    private passengerCummulatedDistance: number = 0;
    private passengerAverageArriveSpeed: number = -1;

    addArrivedPassengerStats(stats: { time: number; distance: number }): void {
        this.passengerArrivedCount++;
        this.passengerCummulatedDistance += stats.distance;
        this.passengerCummulatedTime += stats.time;
        this.passengerAverageArriveSpeed =
            this.passengerCummulatedDistance / this.passengerCummulatedTime;
    }

    getPassengerStats(): any {
        return {
            count: this.passengerCount,
            arrivedCount: this.passengerArrivedCount,
            averageArriveSpeed: this.passengerAverageArriveSpeed
        };
    }

    getCommandLog(): CommandLog {
        return this.logStore;
    }

    private ic: InputController = null;

    setInputController(ic: InputController): void {
        this.ic = ic;
    }

    getInputController(): InputController {
        return this.ic;
    }

    getTravelPathes(): TravelPathes {
        return this.travelPathes;
    }
}
