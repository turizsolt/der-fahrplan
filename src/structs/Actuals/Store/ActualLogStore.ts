import { Store } from '../../Interfaces/Store';
import { Emitable } from '../../../mixins/Emitable';
import { applyMixins } from '../../../mixins/ApplyMixins';
import { Action } from './ActualActionStore';

export interface ActualLogStore extends Emitable { }
const doApply = () => applyMixins(ActualLogStore, [Emitable]);
export class ActualLogStore {
  private actions: Action[] = [];

  constructor(private store: Store) {
    this.init();
  }

  init() { }

  getActions(): readonly Action[] {
    return Object.freeze([...this.actions]);
  }

  addAction(action: Action) {
    console.log('action logged', action);
    this.actions.push(action);
    this.emit('updated', this.getActions());
  }
}
doApply();
