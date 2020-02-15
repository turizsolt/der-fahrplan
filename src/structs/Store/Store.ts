import { injectable } from 'inversify';
import * as shortid from 'shortid';

@injectable()
export class Store {
  private elements: Record<string, any>;

  init() {
    this.elements = {};
    return this;
  }

  register<T>(object: T): string {
    const id = shortid.generate();
    this.elements[id] = object;
    return id;
  }

  get<T>(id: string): T {
    return this.elements[id];
  }
}
