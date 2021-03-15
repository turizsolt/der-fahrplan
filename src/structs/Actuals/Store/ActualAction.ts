export type ActionResult = 'failed' | 'succeded' | 'exception-raised';

export interface Action {
  type: 'assertion' | 'statement' | 'tick' | 'creation' | 'id';
  length?: number;
  object: string;
  objectType?: string;
  function: string;
  params?: any[];
  equalsTo?: any;
  result?: ActionResult;
  tick?: number;
}
