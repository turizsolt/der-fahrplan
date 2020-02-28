import { BaseBrick } from './BaseBrick';
import { injectable, inject } from 'inversify';
import { TYPES } from '../TYPES';
import { Store } from '../Store/Store';
import { BaseRenderer } from './BaseRenderer';

@injectable()
export abstract class ActualBaseBrick implements BaseBrick {
  protected id: string;

  @inject(TYPES.FactoryOfStore) StoreFactory: () => Store;
  protected store: Store;

  abstract getRenderer(): BaseRenderer;

  protected initStore() {
    this.store = this.StoreFactory();
    this.id = this.store.register(this);
  }

  getId() {
    return this.id;
  }
}
