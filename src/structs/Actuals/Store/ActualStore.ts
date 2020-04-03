import { injectable, inject } from 'inversify';
import * as shortid from 'shortid';
import { BaseStorable } from '../../Interfaces/BaseStorable';
import { Platform } from '../../Interfaces/Platform';
import { TYPES } from '../../TYPES';
import { Track } from '../../Interfaces/Track';
import { TrackSwitch } from '../../Interfaces/TrackSwitch';
import { TrackJoint } from '../../Interfaces/TrackJoint';
import { Station } from '../../Scheduling/Station';
import { RouteStop } from '../../Scheduling/RouteStop';
import { Route } from '../../Scheduling/Route';
import { Store } from '../../Interfaces/Store';
import { Wagon } from '../../Interfaces/Wagon';
import { Passenger } from '../../Interfaces/Passenger';

@injectable()
export class ActualStore implements Store {
  private elements: Record<string, BaseStorable>;
  private typedElements: Record<symbol, BaseStorable[]>;
  private factoryMethods: Record<symbol, () => any>;
  private typeOrder: Record<symbol, number>;

  @inject(TYPES.FactoryOfRoute) private RouteFactory: () => Route;
  @inject(TYPES.FactoryOfRouteStop) private RouteStopFactory: () => RouteStop;
  @inject(TYPES.FactoryOfStation) private StationFactory: () => Station;
  @inject(TYPES.FactoryOfPassenger) private PassengerFactory: () => Passenger;

  @inject(TYPES.FactoryOfTrack) private TrackFactory: () => Track;
  @inject(TYPES.FactoryOfTrackSwitch)
  private TrackSwitchFactory: () => TrackSwitch;
  @inject(TYPES.FactoryOfTrackJoint)
  private TrackJointFactory: () => TrackJoint;
  @inject(TYPES.FactoryOfPlatform) private PlatformFactory: () => Platform;
  @inject(TYPES.FactoryOfWagon) private WagonFactory: () => Wagon;

  init() {
    this.elements = {};
    this.typedElements = {};
    this.factoryMethods = {
      [TYPES.Route]: this.RouteFactory,
      [TYPES.RouteStop]: this.RouteStopFactory,
      [TYPES.Station]: this.StationFactory,
      [TYPES.Passenger]: this.PassengerFactory,
      [TYPES.Track]: this.TrackFactory,
      [TYPES.TrackSwitch]: this.TrackSwitchFactory,
      [TYPES.TrackJoint]: this.TrackJointFactory,
      [TYPES.Platform]: this.PlatformFactory,
      [TYPES.Wagon]: this.WagonFactory
    };
    this.typeOrder = {
      [TYPES.Station]: 12,
      [TYPES.RouteStop]: 11,
      [TYPES.Route]: 10,
      [TYPES.Track]: 4,
      [TYPES.TrackSwitch]: 3,
      [TYPES.TrackJoint]: 2,
      [TYPES.Platform]: 1,
      [TYPES.Wagon]: 0,
      [TYPES.Passenger]: -1
    };
    shortid.characters(
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_*'
    );
    return this;
  }

  create<T>(type: symbol): T {
    if (!this.factoryMethods[type]) return null;
    return this.factoryMethods[type]() as T;
  }

  clear() {
    this.elements = {};
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
  }
}
