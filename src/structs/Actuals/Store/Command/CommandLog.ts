import { Store } from '../../../Interfaces/Store';
import { Emitable } from '../../../../mixins/Emitable';
import { applyMixins } from '../../../../mixins/ApplyMixins';
import {
  AssertionCommand,
  Command,
  ProcessableCommand,
  StatementCommand
} from './Command';
import { GlobalController } from '../../../../ui/controllers/GlobalController';
import { CommandProcessor } from './CommandProcessor';
import { CommandResultWithValue } from './CommandResultWithValue';
import { CommandMode } from './CommandMode';

export const GENERATE_ID = 'GENERATE_ID';

export interface CommandLog extends Emitable {}
const doApply = () => applyMixins(CommandLog, [Emitable]);
export class CommandLog {
  private actions: Command[] = [];
  private replayTick: number = 0;
  private replayIndex: number = 0;
  private globalController: GlobalController;
  private nextAction: number = 0;
  private mode: CommandMode;
  private processor: CommandProcessor;

  constructor(private store: Store) {
    this.init();
    this.mode = CommandMode.Master;
    this.processor = new CommandProcessor(this.store, this);
  }

  init() {}

  setMode(mode: CommandMode): void {
    this.mode = mode;
  }

  setInputController(gc: GlobalController) {
    this.globalController = gc;
  }

  setActions(actions: Command[]): void {
    this.actions = actions;
    this.emit('updated', this.persist());
    this.nextAction = 0;
  }

  getActions(): readonly Command[] {
    return Object.freeze([...this.actions]);
  }

  persist(): { mode: CommandMode; actions: readonly Command[] } {
    return {
      mode: this.mode,
      actions: this.getActions()
    };
  }

  private generateIds(command: Command): Command {
    if ((command as any).params) {
      (command as any).params = (command as any).params.map(x =>
        x === GENERATE_ID ? this.store.generateId() : x
      );
    }
    return command;
  }

  addAction(action: Command): CommandResultWithValue {
    const tick = this.store.getTickCount();
    this.actions.push({ ...this.generateIds(action), tick });

    let result = { result: null };

    if (this.mode === CommandMode.Master) {
      result = this.runAction(this.actions.length - 1);
      this.nextAction = this.actions.length;
    }

    this.emit('updated', this.persist());

    return result;
  }

  turnReplayOn(): void {
    this.replayIndex = 0;
    this.replayTick = 0;
    this.setMode(CommandMode.Replay);
    this.store.clear();
  }

  private processParam(param: any): any {
    if (typeof param === 'object' && param && param.id) {
      return this.store.get(param.id);
    }
    return param;
  }

  runNext() {
    if (this.nextAction >= this.actions.length) return;

    this.runAction(this.nextAction);
    this.nextAction++;
  }

  runPrev() {
    if (this.nextAction === 0) return;

    this.nextAction--;
    this.unrunAction(this.nextAction);
  }

  runAll() {
    let returned: CommandResultWithValue;
    do {
      returned = this.runAction(this.nextAction);
      this.nextAction++;
    } while (
      returned.result === 'succeded' &&
      this.nextAction < this.actions.length
    );
    return returned;
  }

  runAllBack() {
    let returned: CommandResultWithValue;
    do {
      this.nextAction--;
      returned = this.unrunAction(this.nextAction);
    } while (returned.result === 'succeded' && this.nextAction > 0);
    return returned;
  }

  runAction(index: number): CommandResultWithValue {
    if (this.actions[index]) {
      // try {
      const action = this.actions[index];
      const { result, returnValue } = this.runner[action.type](action);
      this.actions[index].result = result;
      this.emit('updated', this.persist());
      return { result, returnValue };
      // } catch (e) {
      //   console.log(e);
      //   this.actions[index].result = 'exception-raised';
      //   this.emit('updated', this.persist());
      //   return { result: 'exception-raised' };
      // }
    } else {
      return { result: null };
    }
  }

  unrunAction(index: number): CommandResultWithValue {
    if (this.actions[index]) {
      try {
        const action = this.actions[index];
        const { result, returnValue } = this.runner[action.type](
          this.undo(action)
        );
        this.actions[index].result = undefined;
        this.emit('updated', this.persist());
        return { result, returnValue };
      } catch (e) {
        console.log(e);
        this.actions[index].result = 'exception-raised';
        this.emit('updated', this.persist());
        return { result: 'exception-raised' };
      }
    } else {
      return { result: null };
    }
  }

  private undo(command: Command): Command {
    if (command.type === 'processable') {
      const procCommand = { ...command } as ProcessableCommand;
      procCommand.function = procCommand.function.startsWith('un')
        ? procCommand.function.slice(2)
        : 'un' + procCommand.function;
      return procCommand;
    } else {
      return command;
    }
  }

  private runStatement = (commandToRun: Command): CommandResultWithValue => {
    const action = commandToRun as StatementCommand;
    const obj = this.store.get(action.object);
    const returnValue = obj[action.function](
      ...action.params.map(p => this.processParam(p))
    );
    return { result: 'succeded', returnValue };
  };

  private runAssertion = (commandToRun: Command): CommandResultWithValue => {
    const action = commandToRun as AssertionCommand;
    const obj = this.store.get(action.object);
    const returnValue = obj[action.function](
      ...action.params.map(p => this.processParam(p))
    );

    // todo this is just a value comparison, deep equals needed later on
    return {
      result: returnValue === action.equalsTo ? 'succeded' : 'failed',
      returnValue
    };
  };

  private runProcessable = (commandToRun: Command): CommandResultWithValue => {
    const action = commandToRun as ProcessableCommand;
    const returnValue = this.processor[action.function](
      ...action.params.map(p => this.processParam(p))
    );
    return { result: 'succeded', returnValue };
  };

  private runTick = (commandToRun: Command): CommandResultWithValue => {
    // todo
    return { result: 'succeded' };
  };

  private runner = {
    assertion: this.runAssertion,
    statement: this.runStatement,
    processable: this.runProcessable,
    tick: this.runTick
  };
}
doApply();
