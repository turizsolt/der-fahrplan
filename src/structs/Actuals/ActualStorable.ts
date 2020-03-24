import { injectable, inject } from 'inversify';
import { TYPES } from '../TYPES';
import { BaseStorable } from '../Interfaces/BaseStorable';
import { Store } from '../Interfaces/Store';

@injectable()
export abstract class ActualBaseStorable implements BaseStorable {
  protected id: string;

  @inject(TYPES.FactoryOfStore) StoreFactory: () => Store;
  protected store: Store;

  abstract persist(): Object;
  abstract load(obj: Object, store: Store): void;

  protected initStore() {
    this.store = this.StoreFactory();
    this.id = this.store.register(this, this.id);
  }

  presetId(id: string) {
    this.id = id;
  }

  getId() {
    return this.id;
  }
}
