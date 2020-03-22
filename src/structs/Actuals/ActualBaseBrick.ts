import { BaseBrick } from '../Interfaces/BaseBrick';
import { injectable, inject } from 'inversify';
import { TYPES } from '../TYPES';
import { Store } from '../Actuals/Store/Store';
import { BaseRenderer } from '../Renderers/BaseRenderer';
import { ActualBaseStorable } from './ActualStorable';

@injectable()
export abstract class ActualBaseBrick extends ActualBaseStorable
  implements BaseBrick {
  abstract getRenderer(): BaseRenderer;
}
