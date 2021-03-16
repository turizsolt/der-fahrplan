import { Store } from '../../../Interfaces/Store';
import { Emitable } from '../../../../mixins/Emitable';
import { applyMixins } from '../../../../mixins/ApplyMixins';
import { AssertionCommand, Command, ProcessableCommand, StatementCommand } from './Command';
import { InputController } from '../../../../ui/controllers/InputController';
import { CommandResult } from './CommandResult';
import { CommandProcessor } from './CommandProcessor';

export enum CommandMode {
  Master,
  Network,
  Replay
}

export interface CommandLog extends Emitable { }
const doApply = () => applyMixins(CommandLog, [Emitable]);
export class CommandLog {
  private actions: Command[] = [];
  private replayTick: number = 0;
  private replayIndex: number = 0;
  private inputController: InputController;
  private nextAction: number = 0;
  private mode: CommandMode;
  private processor: CommandProcessor;

  constructor(private store: Store) {
    this.init();
    this.mode = CommandMode.Master;
    this.processor = new CommandProcessor(this.store, this);
  }

  init() { }

  setMode(mode: CommandMode): void {
    this.mode = mode;
  }

  setInputController(ic: InputController) {
    this.inputController = ic;
  }

  setActions(actions: Command[]): void {
    this.actions = actions;
    this.emit('updated', this.getActions());
    this.nextAction = 0;
  }

  getActions(): readonly Command[] {
    return Object.freeze([...this.actions]);
  }

  addAction(action: Command): void {
    const tick = this.store.getTickCount();
    this.actions.push({ ...action, tick });

    if (this.mode === CommandMode.Master) {
      this.runAction(this.actions.length - 1);
    }

    this.emit('updated', this.getActions());
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
    this.runAction(this.nextAction);
    this.nextAction++;
  }

  runAll() {
    let returned: CommandResult;
    do {
      returned = this.runAction(this.nextAction);
      this.nextAction++;
    }
    while (returned === 'succeded' && this.nextAction < this.actions.length);
    return returned;
  }

  runAction(index: number): CommandResult | null {
    if (this.actions[index]) {
      // try {
      const action = this.actions[index];
      const result = this.runner[action.type](action);
      this.actions[index].result = result;
      this.emit('updated', this.getActions());
      //} catch (e) {
      //  console.log(e);
      //  this.actions[index].result = 'exception-raised';
      //  this.emit('updated', this.getActions());
      //  return 'exception-raised';
      //}
    } else {
      return null;
    }
  }

  private runStatement = (commandToRun: Command): CommandResult => {
    const action = commandToRun as StatementCommand;
    const obj = this.store.get(action.object);
    obj[action.function](...action.params.map(p => this.processParam(p)));
    return 'succeded';
  }

  private runAssertion = (commandToRun: Command): CommandResult => {
    const action = commandToRun as AssertionCommand;
    const obj = this.store.get(action.object);
    const returnValue = obj[action.function](...action.params.map(p => this.processParam(p)));

    // todo this is just a value comparison, deep equals needed later on
    return returnValue === action.equalsTo
      ? 'succeded'
      : 'failed';
  }

  private runProcessable = (commandToRun: Command): CommandResult => {
    const action = commandToRun as ProcessableCommand;
    this.processor[action.function](...action.params.map(p => this.processParam(p)));
    return 'succeded';
  }

  private runner = {
    'assertion': this.runAssertion,
    'statement': this.runStatement,
    'processable': this.runProcessable
  };
}
doApply();
