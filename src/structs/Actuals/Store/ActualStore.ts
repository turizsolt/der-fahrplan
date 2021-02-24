import { injectable, inject } from 'inversify';
import * as shortid from 'shortid';
import { BaseStorable } from '../../Interfaces/BaseStorable';
import { Platform } from '../../Interfaces/Platform';
import { TYPES } from '../../../di/TYPES';
import { Track } from '../../Interfaces/Track';
import { TrackSwitch } from '../../Interfaces/TrackSwitch';
import { TrackJoint } from '../../Interfaces/TrackJoint';
import { Station } from '../../Scheduling/Station';
import { RouteStop } from '../../Scheduling/RouteStop';
import { Route } from '../../Scheduling/Route';
import { Store } from '../../Interfaces/Store';
import { Wagon } from '../../Interfaces/Wagon';
import { Passenger } from '../../Interfaces/Passenger';
import { Train } from '../../Scheduling/Train';
import { Trip } from '../../Scheduling/Trip';
import { ActualActionStore } from './ActualActionStore';
import { PassengerGenerator } from '../PassengerGenerator';
import { ActualLogStore } from './ActualLogStore';
import { Commander } from './Commander';

@injectable()
export class ActualStore implements Store {
  private elements: Record<string, BaseStorable>;
  private typedElements: Record<symbol, BaseStorable[]>;
  private factoryMethods: Record<symbol, () => any>;
  private typeOrder: Record<symbol, number>;

  @inject(TYPES.FactoryOfRoute) private RouteFactory: () => Route;
  @inject(TYPES.FactoryOfRouteStop) private RouteStopFactory: () => RouteStop;
  @inject(TYPES.FactoryOfTrip) private TripFactory: () => Trip;
  @inject(TYPES.FactoryOfStation) private StationFactory: () => Station;
  @inject(TYPES.FactoryOfPassenger) private PassengerFactory: () => Passenger;

  @inject(TYPES.FactoryOfTrain) private TrainFactory: () => Train;
  @inject(TYPES.FactoryOfTrack) private TrackFactory: () => Track;
  @inject(TYPES.FactoryOfTrackSwitch)
  private TrackSwitchFactory: () => TrackSwitch;
  @inject(TYPES.FactoryOfTrackJoint)
  private TrackJointFactory: () => TrackJoint;
  @inject(TYPES.FactoryOfPlatform) private PlatformFactory: () => Platform;
  @inject(TYPES.FactoryOfWagon) private WagonFactory: () => Wagon;

  @inject(TYPES.FactoryOfPassengerGenerator) private PassengerGeneratorFactory: () => PassengerGenerator;
  private passengerGenerator: PassengerGenerator;

  private actionStore: ActualActionStore;
  private logStore: ActualLogStore;
  private commander: Commander;

  init() {
    this.actionStore = new ActualActionStore(this);
    this.logStore = new ActualLogStore(this);
    this.commander = new Commander(this, this.logStore);

    this.elements = {};
    this.typedElements = {};
    this.factoryMethods = {
      [TYPES.Route]: this.RouteFactory,
      [TYPES.Trip]: this.TripFactory,
      [TYPES.RouteStop]: this.RouteStopFactory,
      [TYPES.Station]: this.StationFactory,
      [TYPES.Passenger]: this.PassengerFactory,
      [TYPES.Track]: this.TrackFactory,
      [TYPES.TrackSwitch]: this.TrackSwitchFactory,
      [TYPES.TrackJoint]: this.TrackJointFactory,
      [TYPES.Platform]: this.PlatformFactory,
      [TYPES.Train]: this.TrainFactory,
      [TYPES.Wagon]: this.WagonFactory
    };
    this.typeOrder = {
      [TYPES.Station]: 12,
      [TYPES.RouteStop]: 11,
      [TYPES.Route]: 10,
      [TYPES.Trip]: 8,
      [TYPES.Track]: 4,
      [TYPES.TrackSwitch]: 3,
      [TYPES.TrackJoint]: 2,
      [TYPES.Platform]: 1,
      // skip zero, cos it is falsy
      [TYPES.Wagon]: -1,
      [TYPES.Train]: -2,
      [TYPES.Passenger]: -3
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
    return this.factoryMethods[type]() as T;
  }

  clear() {
    this.getFiltered(x => x.getType() === Symbol.for('Wagon')).map(e => e.remove());
    this.getFiltered(() => true).map(e => e.remove());

    this.elements = {};
    this.typedElements = {};
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
    ].filter(x => x.id !== id);
    delete this.elements[id];
  }

  get(id: string): BaseStorable {
    return this.elements[id];
  }

  getAll(): Record<string, BaseStorable> {
    return this.elements;
  }

  getAllOf<T extends BaseStorable>(type: symbol): T[] {
    return this.typedElements[type] || [];
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

  loadAll(arr: any[]) {
    const fx = a => this.typeOrder[Symbol.for(a)] || 999;

    arr.sort((a, b) => {
      return fx(b.type) - fx(a.type);
    });

    arr.map(elem => {
      const brick: BaseStorable = this.create<BaseStorable>(
        Symbol.for(elem.type)
      );

      if (brick) {
        brick.load(elem, this);
      }
    });

    // to init schedules with a blank nothing
    this.getAllOf(Symbol.for('Station')).map((station: Station) => {
      station.addTripToSchedule(null);
    });
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
  private tickCount: number = 0;

  tick(): void {
    if (this.tickSpeed) {
      this.tickCount += this.tickSpeed;
    }

    for (let i = 0; i < this.tickSpeed; i++) {
      this.getAllOf(TYPES.Wagon).map((wagon: Wagon) => {
        wagon.tick();
      });

      if ((this.getTickCount() + i) % 120 === 0) {
        if (!this.passengerGenerator) {
          this.passengerGenerator = this.PassengerGeneratorFactory().init();
        }
        this.passengerGenerator.tick();
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

  getActionStore(): ActualActionStore {
    return this.actionStore;
  }

  getLogStore(): ActualLogStore {
    return this.logStore;
  }

  getCommander(): Commander {
    return this.commander;
  }
}
