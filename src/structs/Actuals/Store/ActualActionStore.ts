import { Store } from '../../Interfaces/Store';
import { Emitable } from '../../../mixins/Emitable';
import { applyMixins } from '../../../mixins/ApplyMixins';

export type ActionResult = 'failed' | 'succeded' | 'exception-raised';

export interface Action {
  type: 'assertion';
  object: string;
  function: string;
  params: any[];
  equalsTo: any;
  result?: ActionResult;
}

export interface ActualActionStore extends Emitable {}
const doApply = () => applyMixins(ActualActionStore, [Emitable]);
export class ActualActionStore {
  private actions: Action[] = [];

  constructor(private store: Store) {
    this.init();
  }

  init() {}

  setActions(actions: Action[]): void {
    this.actions = actions;
    this.emit('updated', this.getActions());
  }

  getActions(): readonly Action[] {
    return Object.freeze([...this.actions]);
  }

  runAction(index: number): ActionResult | null {
    if (this.actions[index]) {
      try {
        const action = this.actions[index];
        const obj = this.store.get(action.object);
        const returnValue = obj[action.function](...action.params);

        // todo this is just a value comparison, deep equals needed later on
        const result: ActionResult =
          returnValue === action.equalsTo ? 'succeded' : 'failed';
        this.actions[index].result = result;

        this.emit('updated', this.getActions());
        return result;
      } catch (e) {
        this.emit('updated', this.getActions());
        return 'exception-raised';
      }
    } else {
      return null;
    }
  }
}
doApply();
