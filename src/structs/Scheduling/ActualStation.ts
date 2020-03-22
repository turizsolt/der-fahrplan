import { Store } from '../Actuals/Store/Store';
import { ActualBaseBrick } from '../Actuals/ActualBaseBrick';
import { BaseRenderer } from '../Renderers/BaseRenderer';
import { Station } from './Station';

export class ActualStation extends ActualBaseBrick implements Station {
  private name: string;

  init(): Station {
    super.initStore();
    this.name = this.id;
    return this;
  }

  getName(): string {
    return this.name;
  }

  setName(name: string) {
    this.name = name;
  }

  getRenderer(): BaseRenderer {
    throw new Error('Method not implemented.');
  }

  persist(): Object {
    throw new Error('Method not implemented.');
  }

  load(obj: Object, store: Store): void {
    throw new Error('Method not implemented.');
  }
}
