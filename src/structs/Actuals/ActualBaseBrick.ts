import { BaseBrick } from '../Interfaces/BaseBrick';
import { injectable, inject } from 'inversify';
import { TYPES } from '../TYPES';
import { Store } from '../Actuals/Store/Store';
import { BaseRenderer } from '../Renderers/BaseRenderer';

@injectable()
export abstract class ActualBaseBrick implements BaseBrick {
  protected id: string;

  @inject(TYPES.FactoryOfStore) StoreFactory: () => Store;
  protected store: Store;

  abstract getRenderer(): BaseRenderer;
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
