import { CommandResult } from "./CommandResult";

export interface Command {
  type: string; //'assertion' | 'statement' | 'tick' | 'creation' | 'id' | 'process';
  result?: CommandResult;
  tick?: number;
}

export interface ProcessableCommand extends Command {
  type: 'processable';
  function: string;
  params?: any[];
}

export interface StatementCommand extends Command {
  type: 'statement';
  object: string;
  function: string;
  params?: any[];
}

export interface AssertionCommand extends Command {
  type: 'assertion';
  object: string;
  function: string;
  params?: any[];
  equalsTo: any;
}
