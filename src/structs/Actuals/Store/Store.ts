import { injectable } from 'inversify';
import * as shortid from 'shortid';
import { BaseStorable } from '../../Interfaces/BaseStorable';
import { babylonContainer } from '../../inversify.config';
import { Platform } from '../../Interfaces/Platform';
import { TYPES } from '../../TYPES';
import { Track } from '../../Interfaces/Track';
import { TrackSwitch } from '../../Interfaces/TrackSwitch';
import { TrackJoint } from '../../Interfaces/TrackJoint';
import { Engine } from '../../Interfaces/Engine';

@injectable()
export class Store {
  private elements: Record<string, BaseStorable>;

  init() {
    this.elements = {};
    shortid.characters(
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_*'
    );
    return this;
  }

  clear() {
    this.elements = {};
  }

  register(object: BaseStorable, presetId: string = null): string {
    let id = presetId || shortid.generate();
    this.elements[id] = object;
    return id;
  }

  unregister(object: BaseStorable): void {
    let id = object.getId();
    delete this.elements[id];
  }

  get(id: string): BaseStorable {
    return this.elements[id];
  }

  getAll(): Record<string, BaseStorable> {
    return this.elements;
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
    const fx = a => {
      switch (a) {
        case 'Engine':
          return 0;
        case 'Platform':
          return 1;
        case 'TrackJoint':
          return 2;
        case 'TrackSwitch':
          return 3;
        case 'Track':
          return 4;
        default:
          return 999;
      }
    };

    arr.sort((a, b) => {
      return fx(b.type) - fx(a.type);
    });

    arr.map(elem => {
      let brick: BaseStorable;
      switch (elem.type) {
        case 'Platform':
          brick = babylonContainer.get<Platform>(TYPES.Platform);
          break;
        case 'Track':
          brick = babylonContainer.get<Track>(TYPES.Track);
          break;
        case 'TrackSwitch':
          brick = babylonContainer.get<TrackSwitch>(TYPES.TrackSwitch);
          break;
        case 'TrackJoint':
          brick = babylonContainer.get<TrackJoint>(TYPES.TrackJoint);
          break;
        case 'Engine':
          brick = babylonContainer.get<Engine>(TYPES.Engine);
          break;
      }

      if (brick) {
        brick.load(elem, this);
      }
    });
  }
}
