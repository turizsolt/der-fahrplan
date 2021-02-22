import { Store } from '../../Interfaces/Store';
import { Emitable } from '../../../mixins/Emitable';
import { applyMixins } from '../../../mixins/ApplyMixins';
import { InputController } from '../../../ui/controllers/InputController';

export type ActionResult = 'failed' | 'succeded' | 'exception-raised';

export interface Action {
  type: 'assertion' | 'statement' | 'tick';
  length?: number;
  object: string;
  function: string;
  params: any[];
  equalsTo: any;
  result?: ActionResult;
}

export interface ActualActionStore extends Emitable { }
const doApply = () => applyMixins(ActualActionStore, [Emitable]);
export class ActualActionStore {
  private actions: Action[] = [];
  private inputController: InputController;

  constructor(private store: Store) {
    this.init();
  }

  init() { }

  setInputController(ic: InputController) {
    this.inputController = ic;
  }

  setActions(actions: Action[]): void {
    this.actions = actions;
    this.emit('updated', this.getActions());
  }

  getActions(): readonly Action[] {
    return Object.freeze([...this.actions]);
  }

  private nextAction: number = 0;

  runNext() {
    this.runAction(this.nextAction);
    this.nextAction++;
  }

  runAll() {
    let returned: ActionResult;
    do {
      returned = this.runAction(this.nextAction);
      this.nextAction++;
    }
    while (returned === 'succeded' && this.nextAction < this.actions.length);
  }

  runAction(index: number): ActionResult | null {
    if (this.actions[index]) {
      try {
        const action = this.actions[index];

        if (action.type === 'tick') {
          if (this.inputController) {
            this.store.setTickSpeed(action.length);
            this.inputController.tick();
            this.store.setTickSpeed(0);

            this.actions[index].result = 'succeded';
            this.emit('updated', this.getActions());
            return 'succeded';
          }
        } else {
          const obj = this.store.get(action.object);
          const returnValue = obj[action.function](...action.params);

          // todo this is just a value comparison, deep equals needed later on
          const result: ActionResult =
            action.type === 'statement' || returnValue === action.equalsTo
              ? 'succeded'
              : 'failed';
          this.actions[index].result = result;

          this.emit('updated', this.getActions());
          return result;
        }
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
