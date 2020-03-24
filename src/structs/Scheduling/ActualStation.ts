import { ActualBaseBrick } from '../Actuals/ActualBaseBrick';
import { BaseRenderer } from '../Renderers/BaseRenderer';
import { Station } from './Station';
import { Store } from '../Interfaces/Store';

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
    return {
      id: this.id,
      type: 'Station',
      name: this.name
    };
  }

  load(obj: any, store: Store): void {
    this.presetId(obj.id);
    this.init();
    this.setName(obj.name);
  }
}
