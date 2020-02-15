import { injectable } from 'inversify';
import * as shortid from 'shortid';

@injectable()
export class Store {
  private elements: Record<string, any>;
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

  register<T>(object: T): string {
    let id = shortid.generate();
    if (this.counter[object.constructor.name]) {
      let x = this.counter[object.constructor.name];
      x.counter++;
      id = x.abbr + x.counter;
    }
    this.elements[id] = object;
    return id;
  }

  get<T>(id: string): T {
    return this.elements[id];
  }
}
