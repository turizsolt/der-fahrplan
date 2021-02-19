import { Store } from '../../Interfaces/Store';

export type ActionResult = 'failed' | 'succeded' | 'exception-raised';

export interface Action {
  type: 'assertion';
  object: string;
  function: string;
  params: any[];
  equalsTo: any;
  result?: ActionResult;
}

export class ActualActionStore {
  private actions: Action[] = [];

  constructor(private store: Store) {}

  setActions(actions: Action[]): void {
    this.actions = actions;
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

        console.log(returnValue, result);

        return result;
      } catch (e) {
        console.log(e, 'exception-raised');
        return 'exception-raised';
      }
    } else {
      console.log(null);
      return null;
    }
  }
}
