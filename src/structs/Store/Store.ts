import { injectable } from 'inversify';
import * as shortid from 'shortid';
import { BaseBrick } from '../Base/BaseBrick';
import { babylonContainer } from '../inversify.config';
import { Platform } from '../Platform/Platform';
import { TYPES } from '../TYPES';
import { Track } from '../Track/Track';
import { TrackSwitch } from '../TrackSwitch/TrackSwitch';
import { TrackJoint } from '../TrackJoint/TrackJoint';
import { Engine } from '../Engine/Engine';

@injectable()
export class Store {
  private elements: Record<string, BaseBrick>;
  private counter: any = {
    ActualTrackJoint: { counter: 0, abbr: 'j' },
    ActualTrack: { counter: 0, abbr: 't' },
    ActualTrackSwitch: { counter: 0, abbr: 's' }
  };

  init() {
    this.elements = {};
    shortid.characters(
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_*'
    );
    return this;
  }

  register(object: BaseBrick, presetId: string = null): string {
    let id = presetId || shortid.generate();
    this.elements[id] = object;
    return id;
  }

  unregister(object: BaseBrick): void {
    let id = object.getId();
    delete this.elements[id];
  }

  get(id: string): BaseBrick {
    return this.elements[id];
  }

  getAll(): Record<string, BaseBrick> {
    return this.elements;
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
      let brick: BaseBrick;
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
