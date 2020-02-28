import { injectable } from 'inversify';
import * as shortid from 'shortid';
import { BaseBrick } from '../Base/BaseBrick';

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

  register(object: BaseBrick): string {
    let id = shortid.generate();
    if (this.counter[object.constructor.name]) {
      let x = this.counter[object.constructor.name];
      x.counter++;
      id = x.abbr + x.counter;
    }
    this.elements[id] = object;
    return id;
  }

  get(id: string): BaseBrick {
    return this.elements[id];
  }

  getAll(): Record<string, BaseBrick> {
    return this.elements;
  }
}
