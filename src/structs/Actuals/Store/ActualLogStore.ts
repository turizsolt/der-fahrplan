import { Store } from '../../Interfaces/Store';
import { Emitable } from '../../../mixins/Emitable';
import { applyMixins } from '../../../mixins/ApplyMixins';
import { Action, ActionResult } from './ActualAction';
import { CommandMode } from './Commander';
import { InputController } from '../../../ui/controllers/InputController';

export interface ActualLogStore extends Emitable { }
const doApply = () => applyMixins(ActualLogStore, [Emitable]);
export class ActualLogStore {
  private actions: Action[] = [];
  private replayTick: number = 0;
  private replayIndex: number = 0;
  private inputController: InputController;
  private nextAction: number = 0;

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
    this.nextAction = 0;
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

  private processParam(param: any): any {
    if (typeof param === 'object' && param.id) {
      return this.store.get(param.id);
    }
    return param;
  }

  getPresetId(type: string): string {
    if (this.replayIndex >= this.actions.length) {
      return;
    }

    const nextTickCount = this.actions[this.replayIndex].tick;

    let i = this.replayIndex;
    while (i < this.actions.length && this.actions[i].tick === nextTickCount) {
      if (this.actions[i].type === 'id' && this.actions[i].objectType === type) {
        return this.actions[i].object;
      }
      i++;
    }
    i = this.replayIndex - 1;
    while (i > -1 && this.actions[i].tick === nextTickCount) {
      if (this.actions[i].type === 'id' && this.actions[i].objectType === type) {
        return this.actions[i].object;
      }
      i--;
    }
    return null;
  }

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
    return returned;
  }

  runAction(index: number): ActionResult | null {
    if (this.actions[index]) {
      try {
        const action = this.actions[index];

        if (action.type === 'id') {
          this.actions[index].result = 'succeded';
          this.emit('updated', this.getActions());
          return 'succeded';
        } else if (action.type === 'creation') {
          const obj: any = this.store.create(Symbol.for(action.objectType));
          obj.presetId(action.object);
          obj.init(...action.params.map(p => this.processParam(p)));

          this.actions[index].result = 'succeded';
          this.emit('updated', this.getActions());
          return 'succeded';
        } else {
          const obj = this.store.get(action.object);
          const returnValue = obj[action.function](...action.params.map(p => this.processParam(p)));

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
