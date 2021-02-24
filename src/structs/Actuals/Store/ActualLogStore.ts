import { Store } from '../../Interfaces/Store';
import { Emitable } from '../../../mixins/Emitable';
import { applyMixins } from '../../../mixins/ApplyMixins';
import { Action, ActionResult } from './ActualActionStore';
import { CommandMode } from './Commander';
import { InputController } from '../../../ui/controllers/InputController';
import { BaseStorable } from '../../Interfaces/BaseStorable';

export interface ActualLogStore extends Emitable { }
const doApply = () => applyMixins(ActualLogStore, [Emitable]);
export class ActualLogStore {
  private actions: Action[] = [];
  private replayTick: number = 0;
  private replayIndex: number = 0;
  private inputController: InputController;

  constructor(private store: Store) {
    this.init();
  }

  init() { }

  setInputController(ic: InputController) {
    this.inputController = ic;
  }

  getActions(): readonly Action[] {
    return Object.freeze([...this.actions]);
  }

  addAction(action: Action): void {
    const tick = this.store.getTickCount();
    this.actions.push({ ...action, tick });
    this.emit('updated', this.getActions());
  }

  turnReplayOn(): void {
    this.replayIndex = 0;
    this.replayTick = 0;
    this.store.getCommander().setMode(CommandMode.Replay);
    this.store.clear();
  }

  nextTick(): void {
    if (this.replayIndex >= this.actions.length) {
      console.log('on end');
      return;
    }

    const nextTickCount = this.actions[this.replayIndex].tick;
    for (; this.replayTick < nextTickCount; this.replayTick++) {
      if (this.inputController) {
        this.inputController.tick();
      } else {
        this.store.tick();
      }
    }
    while (this.replayIndex < this.actions.length && this.actions[this.replayIndex].tick === nextTickCount) {
      this.runAction(this.replayIndex);
      this.replayIndex++;
    }
    if (this.inputController) {
      this.inputController.tick();
    } else {
      this.store.tick();
    }
  }


  runAction(index: number): ActionResult | null {
    if (this.actions[index]) {
      try {
        const action = this.actions[index];

        if (action.type === 'creation') {
          const obj: any = this.store.create(Symbol.for(action.objectType));
          obj.init(...action.params);

          this.actions[index].result = 'succeded';
          this.emit('updated', this.getActions());
          return 'succeded';
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
        console.log(e);
        this.actions[index].result = 'exception-raised';
        this.emit('updated', this.getActions());
        return 'exception-raised';
      }
    } else {
      return null;
    }
  }
}
doApply();
